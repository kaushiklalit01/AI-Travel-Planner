// Smart fallback generator when Groq API key is inactive or offline
// Ensures the app always generates a realistic, schema-valid itinerary for testing and demoing

const DESTINATION_COORDS = {
  goa: { lat: 15.4989, lng: 73.8278, state: "Goa" },
  manali: { lat: 32.2396, lng: 77.1887, state: "Himachal Pradesh" },
  ladakh: { lat: 34.1526, lng: 77.5771, state: "Ladakh" },
  kerala: { lat: 9.9312, lng: 76.2673, state: "Kerala" },
  jaipur: { lat: 26.9124, lng: 75.7873, state: "Rajasthan" },
  rishikesh: { lat: 30.0869, lng: 78.2676, state: "Uttarakhand" },
};

function getCoords(destination) {
  const key = Object.keys(DESTINATION_COORDS).find((k) =>
    destination.toLowerCase().includes(k)
  );
  if (key) return DESTINATION_COORDS[key];
  return { lat: 20.5937, lng: 78.9629, state: "India" };
}

function generateFallbackPlan({ destination, days, budget, interests }) {
  const totalDays = Math.max(1, Math.min(Number(days) || 3, 14));
  const totalBudget = Number(budget) || 25000;
  const baseCoords = getCoords(destination);

  const hotelBudget = Math.round(totalBudget * 0.4);
  const foodBudget = Math.round(totalBudget * 0.25);
  const transportBudget = Math.round(totalBudget * 0.15);
  const activitiesBudget = Math.round(totalBudget * 0.1);
  const miscBudget = totalBudget - (hotelBudget + foodBudget + transportBudget + activitiesBudget);

  const dayPlans = [];
  const slotThemes = [
    { slot: "Morning", time: "09:00 AM", act: "Heritage & Landmark Exploration", dur: "2.5 hours", cost: 300 },
    { slot: "Afternoon", time: "01:30 PM", act: "Local Market & Cultural Immersion", dur: "3 hours", cost: 500 },
    { slot: "Evening", time: "06:00 PM", act: "Scenic Sunset Point & Leisure Walk", dur: "2 hours", cost: 200 },
  ];

  for (let d = 1; d <= totalDays; d++) {
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;

    dayPlans.push({
      day: d,
      title: `Day ${d}: Discovering ${destination} - Highlights & Hidden Corners`,
      theme: d === 1 ? "Arrival & Orientation" : d === totalDays ? "Farewell & Souvenirs" : "Deep Exploration",
      activities: slotThemes.map((st, idx) => ({
        timeSlot: st.slot,
        time: st.time,
        title: `${st.act} in ${destination}`,
        description: `Explore the vibrant local surroundings of ${destination}. Experience scenic views, interact with local artisans, and capture memorable photos.`,
        locationName: `${destination} Landmark ${d}.${idx + 1}`,
        latitude: parseFloat((baseCoords.lat + latOffset + idx * 0.01).toFixed(4)),
        longitude: parseFloat((baseCoords.lng + lngOffset + idx * 0.01).toFixed(4)),
        duration: st.dur,
        estimatedCost: st.cost,
        travelNotes: "Wear comfortable walking shoes; carry bottled water and sun protection.",
      })),
      restaurantSuggestion: {
        name: `${destination} Heritage Cafe & Dining`,
        cuisine: "Authentic Regional Cuisine",
        priceRange: "₹₹",
        recommendedDish: "Chef's Special Regional Thali & Fresh Beverages",
      },
    });
  }

  return {
    tripTitle: `${totalDays}-Day Curated ${destination} Adventure`,
    summary: `A balanced ${totalDays}-day experience in ${destination} blending top attractions, authentic local dining, and relaxing cultural moments tailored to your budget.`,
    destination,
    bestTimeToVisit: "October to March",
    days: dayPlans,
    budget: {
      hotel: hotelBudget,
      food: foodBudget,
      transport: transportBudget,
      activities: activitiesBudget,
      misc: miscBudget,
      currency: "INR",
    },
    hotelSuggestions: [
      {
        name: `${destination} Boutique Retreat`,
        type: "Boutique Hotel",
        pricePerNight: Math.round(hotelBudget / totalDays),
        area: "Central Historic Quarter",
        highlight: "Walking distance to primary markets, free breakfast & scenic views",
      },
      {
        name: `${destination} Eco Resort & Spa`,
        type: "Eco Resort",
        pricePerNight: Math.round((hotelBudget / totalDays) * 1.2),
        area: "Serene Outskirts",
        highlight: "Quiet surroundings, mountain/nature vistas, on-site dining",
      },
    ],
    travelTips: [
      `Rent a local two-wheeler or book registered prepaid cabs for easy transit in ${destination}.`,
      "Start morning activities before 10 AM to avoid peak crowds and afternoon heat.",
      "Carry some cash as smaller artisan stalls and local street vendors may have spotty UPI networks in remote areas.",
      "Check local temple and museum dress codes before visiting religious sites.",
    ],
    warningsAndAlternatives: [
      {
        warning: `High traffic congestion along primary tourist roads in ${destination} during 5 PM – 8 PM.`,
        alternative: "Plan evening sightseeing within walking distance or use local ferry/metro routes where available.",
      },
      {
        warning: "Street vendors outside main monuments may charge elevated tourist rates.",
        alternative: "Buy souvenirs from government-certified emporiums or verified night markets with fixed prices.",
      },
    ],
  };
}

module.exports = generateFallbackPlan;
