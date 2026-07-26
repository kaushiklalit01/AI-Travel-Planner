const plannerPrompt = `
You are an expert AI Travel Assistant.

Generate a travel plan based on the following information:

Destination: {destination}
Days: {days}
Budget: ₹{budget}
Interests: {interests}

Return ONLY a valid JSON object.

Do NOT include:
- Markdown
- Triple backticks
- Explanations
- Any text before or after the JSON

The JSON must follow this exact structure:

{
  "tripTitle": "string",
  "summary": "string",
  "days": [
    {
      "day": 1,
      "title": "string",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "string"
        }
      ]
    }
  ],
  "budget": {
    "hotel": 0,
    "food": 0,
    "transport": 0,
    "misc": 0
  },
  "travelTips": [
    "string"
  ]
}

Requirements:
- Create a realistic itinerary.
- Keep the total estimated budget close to the user's budget.
- Suggest popular attractions.
- Include meal recommendations.
- Keep activities in chronological order.
- Give practical travel tips.
`;
module.exports = plannerPrompt;