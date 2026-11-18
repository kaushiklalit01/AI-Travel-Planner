const prisma = require("../db/prisma");
const generateTravelPlan = require("../Agents/plannerAgent");
const refineItinerary = require("../Agents/refinerAgent");
const getDestinationImages = require("../services/imageService");
const getWeather = require("../services/weatherService");
const { generateItineraryPdf } = require("../services/pdfService");

// Create and generate a new trip
const createTrip = async (req, res) => {
  try {
    const { destination, days, budget, interests, preferences } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Destination is required.",
      });
    }

    const totalDays = Number(days) || preferences?.days || 4;
    const totalBudget = Number(budget) || preferences?.budgetAmount || 30000;
    const combinedInterests = Array.isArray(interests) ? interests : [interests || "sightseeing"];

    // 1. Create Initial Trip Record in GENERATING status
    const initialTrip = await prisma.trip.create({
      data: {
        userId,
        destination,
        title: `${totalDays}-Day ${destination} Trip`,
        status: "GENERATING",
        totalBudget,
        currency: "INR",
        preferences: {
          create: {
            startDate: preferences?.startDate || null,
            endDate: preferences?.endDate || null,
            totalDays,
            travelParty: preferences?.partyType || "Friends",
            travelerCount: preferences?.travelerCount || 2,
            travelStyle: Array.isArray(preferences?.selectedStyles)
              ? preferences.selectedStyles.join(", ")
              : "Adventure, Foodie",
            budgetTier: preferences?.budgetTier || "Moderate",
            budgetAmount: totalBudget,
            pace: preferences?.pace || "Balanced",
            interests: combinedInterests.join(", "),
            specialRequests: preferences?.specialRequests || null,
          },
        },
      },
      include: {
        preferences: true,
      },
    });

    try {
      // 2. Invoke AI Planner Agent
      const generatedPlan = await generateTravelPlan({
        destination,
        days: totalDays,
        budget: totalBudget,
        interests: combinedInterests,
      });

      // 3. Fetch Destination Photos and Weather concurrently
      const [destinationImages, weather] = await Promise.all([
        getDestinationImages(destination).catch(() => []),
        getWeather(destination).catch(() => null),
      ]);

      // 4. Create Days and Activities in DB
      for (const day of generatedPlan.days) {
        const createdDay = await prisma.itineraryDay.create({
          data: {
            tripId: initialTrip.id,
            dayNumber: day.day,
            title: day.title,
            theme: day.theme || null,
            restaurantName: day.restaurantSuggestion?.name || null,
            restaurantCuisine: day.restaurantSuggestion?.cuisine || null,
            restaurantPrice: day.restaurantSuggestion?.priceRange || null,
            restaurantDish: day.restaurantSuggestion?.recommendedDish || null,
          },
        });

        if (day.activities && day.activities.length > 0) {
          const activityData = day.activities.map((act, idx) => ({
            dayId: createdDay.id,
            timeSlot: act.timeSlot || "Morning",
            time: act.time || "09:00 AM",
            title: act.title || act.activity,
            description: act.description || "",
            locationName: act.locationName || null,
            latitude: act.latitude ? parseFloat(act.latitude) : null,
            longitude: act.longitude ? parseFloat(act.longitude) : null,
            duration: act.duration || "2 hours",
            estimatedCost: act.estimatedCost ? parseFloat(act.estimatedCost) : 0,
            travelNotes: act.travelNotes || null,
            orderIndex: idx,
          }));

          await prisma.activity.createMany({
            data: activityData,
          });
        }
      }

      // 5. Update Trip to READY status with complete metadata
      const updatedTrip = await prisma.trip.update({
        where: { id: initialTrip.id },
        data: {
          title: generatedPlan.tripTitle || initialTrip.title,
          summary: generatedPlan.summary || null,
          bestTimeToVisit: generatedPlan.bestTimeToVisit || "October to March",
          status: "READY",
          hotelSuggestions: JSON.stringify(generatedPlan.hotelSuggestions || []),
          warnings: JSON.stringify(generatedPlan.warningsAndAlternatives || []),
        },
        include: {
          preferences: true,
          itineraryDays: {
            include: {
              activities: {
                orderBy: { orderIndex: "asc" },
              },
            },
            orderBy: { dayNumber: "asc" },
          },
        },
      });

      // Format response compatible with frontend workspace
      return res.status(201).json({
        success: true,
        trip: updatedTrip,
        itinerary: generatedPlan,
        destinationImages,
        weather,
      });

    } catch (generationError) {
      console.error("Trip Generation Error:", generationError);
      // Mark as FAILED so user sees honest status
      await prisma.trip.update({
        where: { id: initialTrip.id },
        data: { status: "FAILED" },
      });

      return res.status(500).json({
        success: false,
        message: "Failed to generate itinerary. Please try again.",
        tripId: initialTrip.id,
      });
    }

  } catch (error) {
    console.error("Create Trip Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create trip.",
    });
  }
};

// Get all trips
const getTrips = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    const where = userId ? { userId } : {};

    const trips = await prisma.trip.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        preferences: true,
        _count: {
          select: { itineraryDays: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      trips,
    });
  } catch (error) {
    console.error("Get Trips Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load trips.",
    });
  }
};

// Get single trip by ID with complete days and activities
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        preferences: true,
        itineraryDays: {
          include: {
            activities: {
              orderBy: { orderIndex: "asc" },
            },
          },
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    // Reconstruct frontend-friendly itinerary object
    let hotelSuggestions = [];
    let warningsAndAlternatives = [];

    try {
      if (trip.hotelSuggestions) hotelSuggestions = JSON.parse(trip.hotelSuggestions);
      if (trip.warnings) warningsAndAlternatives = JSON.parse(trip.warnings);
    } catch (e) {
      // Ignore JSON parse errors for optional fields
    }

    const reconstructedDays = trip.itineraryDays.map((d) => ({
      day: d.dayNumber,
      title: d.title,
      theme: d.theme || "Exploration",
      activities: d.activities.map((a) => ({
        timeSlot: a.timeSlot,
        time: a.time,
        title: a.title,
        description: a.description,
        locationName: a.locationName || "",
        latitude: a.latitude,
        longitude: a.longitude,
        duration: a.duration || "2 hours",
        estimatedCost: a.estimatedCost || 0,
        travelNotes: a.travelNotes || "",
      })),
      restaurantSuggestion: d.restaurantName
        ? {
            name: d.restaurantName,
            cuisine: d.restaurantCuisine || "Local Cuisine",
            priceRange: d.restaurantPrice || "₹₹",
            recommendedDish: d.restaurantDish || "Chef's Special",
          }
        : undefined,
    }));

    const formattedItinerary = {
      tripTitle: trip.title,
      summary: trip.summary || "",
      destination: trip.destination,
      bestTimeToVisit: trip.bestTimeToVisit || "October to March",
      days: reconstructedDays,
      budget: {
        hotel: Math.round((trip.totalBudget || 30000) * 0.4),
        food: Math.round((trip.totalBudget || 30000) * 0.25),
        transport: Math.round((trip.totalBudget || 30000) * 0.15),
        activities: Math.round((trip.totalBudget || 30000) * 0.1),
        misc: Math.round((trip.totalBudget || 30000) * 0.1),
        currency: trip.currency || "INR",
      },
      hotelSuggestions,
      warningsAndAlternatives,
      travelTips: [
        `Book transport and entry tickets in advance when travelling in ${trip.destination}.`,
        "Keep digital and offline copies of your daily itinerary handy.",
        "Check local weather alerts in the morning before heading out.",
      ],
    };

    // Concurrently fetch images & weather for rich rendering
    const [destinationImages, weather] = await Promise.all([
      getDestinationImages(trip.destination).catch(() => []),
      getWeather(trip.destination).catch(() => null),
    ]);

    return res.status(200).json({
      success: true,
      trip,
      itinerary: formattedItinerary,
      destinationImages,
      weather,
    });
  } catch (error) {
    console.error("Get Trip By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load trip details.",
    });
  }
};

// Update / Rename trip
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary } = req.body;

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        title: title ? title.trim() : undefined,
        summary: summary ? summary.trim() : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully!",
      trip: updated,
    });
  } catch (error) {
    console.error("Update Trip Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update trip.",
    });
  }
};

// Duplicate an existing trip
const duplicateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const source = await prisma.trip.findUnique({
      where: { id },
      include: {
        preferences: true,
        itineraryDays: {
          include: {
            activities: true,
          },
        },
      },
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        message: "Original trip not found.",
      });
    }

    // Create cloned Trip
    const clonedTrip = await prisma.trip.create({
      data: {
        userId: userId || source.userId,
        destination: source.destination,
        title: `${source.title} (Copy)`,
        status: source.status,
        summary: source.summary,
        bestTimeToVisit: source.bestTimeToVisit,
        totalBudget: source.totalBudget,
        currency: source.currency,
        hotelSuggestions: source.hotelSuggestions,
        warnings: source.warnings,
        preferences: source.preferences
          ? {
              create: {
                startDate: source.preferences.startDate,
                endDate: source.preferences.endDate,
                totalDays: source.preferences.totalDays,
                travelParty: source.preferences.travelParty,
                travelerCount: source.preferences.travelerCount,
                travelStyle: source.preferences.travelStyle,
                budgetTier: source.preferences.budgetTier,
                budgetAmount: source.preferences.budgetAmount,
                pace: source.preferences.pace,
                interests: source.preferences.interests,
                specialRequests: source.preferences.specialRequests,
              },
            }
          : undefined,
      },
    });

    // Clone Days and Activities
    for (const day of source.itineraryDays) {
      const clonedDay = await prisma.itineraryDay.create({
        data: {
          tripId: clonedTrip.id,
          dayNumber: day.dayNumber,
          title: day.title,
          theme: day.theme,
          restaurantName: day.restaurantName,
          restaurantCuisine: day.restaurantCuisine,
          restaurantPrice: day.restaurantPrice,
          restaurantDish: day.restaurantDish,
        },
      });

      if (day.activities && day.activities.length > 0) {
        await prisma.activity.createMany({
          data: day.activities.map((a) => ({
            dayId: clonedDay.id,
            timeSlot: a.timeSlot,
            time: a.time,
            title: a.title,
            description: a.description,
            locationName: a.locationName,
            latitude: a.latitude,
            longitude: a.longitude,
            duration: a.duration,
            estimatedCost: a.estimatedCost,
            travelNotes: a.travelNotes,
            orderIndex: a.orderIndex,
          })),
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Trip duplicated successfully!",
      tripId: clonedTrip.id,
    });
  } catch (error) {
    console.error("Duplicate Trip Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to duplicate trip.",
    });
  }
};

// Delete trip
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.trip.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Trip deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Trip Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete trip.",
    });
  }
};

// Refine existing trip with user instruction
const refineTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { instruction, currentItinerary } = req.body;

    if (!instruction) {
      return res.status(400).json({
        success: false,
        message: "Refinement instruction is required.",
      });
    }

    // Call refiner agent
    const refined = await refineItinerary({
      currentItinerary,
      instruction,
    });

    // If ID exists in database, update DB days and activities
    if (id && id.length > 10) {
      try {
        const existing = await prisma.trip.findUnique({ where: { id } });
        if (existing) {
          // Update title and summary
          await prisma.trip.update({
            where: { id },
            data: {
              title: refined.tripTitle,
              summary: refined.summary,
              hotelSuggestions: JSON.stringify(refined.hotelSuggestions || []),
              warnings: JSON.stringify(refined.warningsAndAlternatives || []),
            },
          });

          // Delete old days and replace with refined
          await prisma.itineraryDay.deleteMany({ where: { tripId: id } });

          for (const day of refined.days) {
            const createdDay = await prisma.itineraryDay.create({
              data: {
                tripId: id,
                dayNumber: day.day,
                title: day.title,
                theme: day.theme || null,
                restaurantName: day.restaurantSuggestion?.name || null,
                restaurantCuisine: day.restaurantSuggestion?.cuisine || null,
                restaurantPrice: day.restaurantSuggestion?.priceRange || null,
                restaurantDish: day.restaurantSuggestion?.recommendedDish || null,
              },
            });

            if (day.activities && day.activities.length > 0) {
              await prisma.activity.createMany({
                data: day.activities.map((act, idx) => ({
                  dayId: createdDay.id,
                  timeSlot: act.timeSlot || "Morning",
                  time: act.time || "09:00 AM",
                  title: act.title || act.activity,
                  description: act.description || "",
                  locationName: act.locationName || null,
                  latitude: act.latitude ? parseFloat(act.latitude) : null,
                  longitude: act.longitude ? parseFloat(act.longitude) : null,
                  duration: act.duration || "2 hours",
                  estimatedCost: act.estimatedCost ? parseFloat(act.estimatedCost) : 0,
                  travelNotes: act.travelNotes || null,
                  orderIndex: idx,
                })),
              });
            }
          }
        }
      } catch (dbErr) {
        console.warn("DB update during refine skipped or failed:", dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Itinerary refined successfully!",
      itinerary: refined,
    });
  } catch (error) {
    console.error("Refine Trip Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to refine trip.",
    });
  }
};

// Export Itinerary as Server-Side PDF
const exportTripPdf = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        preferences: true,
        itineraryDays: {
          include: {
            activities: {
              orderBy: { orderIndex: "asc" },
            },
          },
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found for export.",
      });
    }

    const formattedDays = trip.itineraryDays.map((d) => ({
      day: d.dayNumber,
      title: d.title,
      theme: d.theme,
      restaurantSuggestion: d.restaurantName
        ? {
            name: d.restaurantName,
            cuisine: d.restaurantCuisine || "Local Cuisine",
            priceRange: d.restaurantPrice || "₹₹",
            recommendedDish: d.restaurantDish || "Chef Special",
          }
        : undefined,
      activities: d.activities.map((a) => ({
        timeSlot: a.timeSlot,
        time: a.time,
        title: a.title,
        description: a.description,
        locationName: a.locationName,
        duration: a.duration,
        estimatedCost: a.estimatedCost,
        travelNotes: a.travelNotes,
      })),
    }));

    const sanitizedTitle = (trip.destination || "itinerary").toLowerCase().replace(/[^a-z0-9]/g, "-");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="itinera-${sanitizedTitle}.pdf"`
    );

    const fullTripData = {
      ...trip,
      itinerary: {
        tripTitle: trip.title,
        summary: trip.summary || "Curated multi-day travel itinerary planned by Itinera AI.",
        destination: trip.destination,
        days: formattedDays,
        budget: {
          hotel: Math.round((trip.totalBudget || 30000) * 0.4),
          food: Math.round((trip.totalBudget || 30000) * 0.25),
          transport: Math.round((trip.totalBudget || 30000) * 0.15),
          activities: Math.round((trip.totalBudget || 30000) * 0.1),
          misc: Math.round((trip.totalBudget || 30000) * 0.1),
        },
        travelTips: [
          `Carry comfortable footwear and weather-appropriate attire for ${trip.destination}.`,
          "Keep physical or downloaded offline copies of reservations and ID proofs.",
          "Check local timings for museums, forts, and monuments before morning departure.",
        ],
      },
    };

    generateItineraryPdf(fullTripData, res);
  } catch (error) {
    console.error("PDF Export Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate PDF.",
    });
  }
};

// Invite a collaborator to the trip
const inviteTripMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Collaborator email is required.",
      });
    }

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found." });
    }

    // Find or create user placeholder
    let targetUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!targetUser) {
      // Create guest collaborator user
      targetUser = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name: email.split("@")[0],
          passwordHash: "INVITED_COLLABORATOR",
        },
      });
    }

    // Upsert member
    const member = await prisma.tripMember.create({
      data: {
        tripId: id,
        userId: targetUser.id,
        role: role || "viewer",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: `Invited ${targetUser.email} as ${member.role}!`,
      member,
    });
  } catch (error) {
    console.error("Invite Member Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to invite member.",
    });
  }
};

// Get trip members
const getTripMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const members = await prisma.tripMember.findMany({
      where: { tripId: id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load members." });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  duplicateTrip,
  deleteTrip,
  refineTrip,
  exportTripPdf,
  inviteTripMember,
  getTripMembers,
};
