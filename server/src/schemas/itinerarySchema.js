const { z } = require("zod");

const activitySchema = z.object({
  timeSlot: z.string().default("Morning"), // "Morning", "Afternoon", "Evening", "Night"
  time: z.string().default("09:00 AM"),
  title: z.string().default("Sightseeing"),
  description: z.string().default(""),
  locationName: z.string().default(""),
  latitude: z.number().nullable().optional().default(null),
  longitude: z.number().nullable().optional().default(null),
  duration: z.string().default("2 hours"),
  estimatedCost: z.number().default(0),
  travelNotes: z.string().default(""),
});

const restaurantSuggestionSchema = z.object({
  name: z.string().default("Local Eatery"),
  cuisine: z.string().default("Local Cuisine"),
  priceRange: z.string().default("₹₹"),
  recommendedDish: z.string().default("Chef Special"),
}).optional();

const daySchema = z.object({
  day: z.number(),
  title: z.string(),
  theme: z.string().default("Exploration"),
  activities: z.array(activitySchema).default([]),
  restaurantSuggestion: restaurantSuggestionSchema,
});

const hotelSuggestionSchema = z.object({
  name: z.string(),
  type: z.string().default("Hotel / Resort"),
  pricePerNight: z.number().default(2500),
  area: z.string().default("Central"),
  highlight: z.string().default("Good location, free Wi-Fi"),
});

const warningAlternativeSchema = z.object({
  warning: z.string(),
  alternative: z.string(),
});

const itinerarySchema = z.object({
  tripTitle: z.string(),
  summary: z.string(),
  destination: z.string().optional().default(""),
  bestTimeToVisit: z.string().optional().default("October to March"),
  days: z.array(daySchema),
  budget: z.object({
    hotel: z.number().default(0),
    food: z.number().default(0),
    transport: z.number().default(0),
    activities: z.number().default(0),
    misc: z.number().default(0),
    currency: z.string().default("INR"),
  }),
  hotelSuggestions: z.array(hotelSuggestionSchema).default([]),
  travelTips: z.array(z.string()).default([]),
  warningsAndAlternatives: z.array(warningAlternativeSchema).default([]),
});

module.exports = {
  itinerarySchema,
  daySchema,
  activitySchema,
};
