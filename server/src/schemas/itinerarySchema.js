const { z } = require("zod");

const itinerarySchema = z.object({
  tripTitle: z.string(),
  summary: z.string(),

  days: z.array(
    z.object({
      day: z.number(),
      title: z.string(),

      activities: z.array(
        z.object({
          time: z.string(),
          activity: z.string(),
        })
      ),
    })
  ),

  budget: z.object({
    hotel: z.number(),
    food: z.number(),
    transport: z.number(),
    misc: z.number(),
  }),

  travelTips: z.array(z.string()),
});

module.exports = {
  itinerarySchema,
};