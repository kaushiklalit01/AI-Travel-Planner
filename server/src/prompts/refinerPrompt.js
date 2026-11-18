const refinerPrompt = `
You are an expert AI Travel Planner Assistant.

The traveler has requested an update or refinement to their existing itinerary.

User Refinement Request:
"{instruction}"

Current Itinerary JSON:
{currentItinerary}

Instructions:
1. Modify the itinerary to fulfill the user's refinement request.
2. If they ask to make a day cheaper, reduce activity costs or suggest budget-friendly local alternatives.
3. If they ask for more food experiences, add street food walks or famous cafes in the afternoon/evening.
4. If they ask to replace an activity, swap it with an authentic local attraction nearby.
5. Preserve the overall structure, destination, and other unchanged days.
6. Return ONLY valid JSON adhering to the exact itinerary schema without markdown backticks or commentary.
`;

module.exports = refinerPrompt;
