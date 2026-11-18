const { ChatGroq } = require("@langchain/groq");
const refinerPrompt = require("../prompts/refinerPrompt");
const { itinerarySchema } = require("../schemas/itinerarySchema");
const extractJson = require("../utils/extractJson");

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes("your_")) {
    return null;
  }
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    temperature: 0.4,
  });
};

function fallbackRefine(currentItinerary, instruction) {
  const cloned = JSON.parse(JSON.stringify(currentItinerary));
  const ins = (instruction || "").toLowerCase();

  if (ins.includes("cheap") || ins.includes("budget")) {
    // Reduce budget and activity costs
    if (cloned.budget) {
      cloned.budget.hotel = Math.round((cloned.budget.hotel || 10000) * 0.8);
      cloned.budget.food = Math.round((cloned.budget.food || 5000) * 0.85);
      cloned.budget.activities = Math.round((cloned.budget.activities || 3000) * 0.7);
    }
    cloned.days?.forEach((d) => {
      d.activities?.forEach((a) => {
        a.estimatedCost = Math.round((a.estimatedCost || 200) * 0.6);
        a.travelNotes = "Free entry or discounted student/senior concession available.";
      });
    });
    cloned.travelTips = [
      "Use shared public buses and ferries to save significantly on local transit.",
      ...(cloned.travelTips || []),
    ];
  } else if (ins.includes("food") || ins.includes("restaurant") || ins.includes("dining")) {
    // Add food tours and regional delicacies
    cloned.days?.forEach((d, idx) => {
      if (d.activities && d.activities.length > 1) {
        d.activities[1].title = `Local Food Tasting & Street Market Walk (Day ${d.day})`;
        d.activities[1].description = "Sample iconic regional delicacies, street food stalls, and traditional sweets guided by local vendors.";
        d.activities[1].travelNotes = "Try the house specialty; ask for moderate spice level if sensitive.";
      }
    });
  } else if (ins.includes("walk") || ins.includes("relaxed") || ins.includes("slow")) {
    // Group closer together & relax pace
    cloned.days?.forEach((d) => {
      d.theme = "Relaxed & Scenic";
      d.activities?.forEach((a) => {
        a.duration = "3 hours (Relaxed)";
        a.travelNotes = "Take your time at leisurely cafes; minimal walking required.";
      });
    });
  } else {
    // General refinement: add note and tweak day 1
    if (cloned.days && cloned.days.length > 0 && cloned.days[0].activities.length > 0) {
      cloned.days[0].activities[0].travelNotes = `Updated per request: ${instruction}`;
    }
  }

  cloned.tripTitle = cloned.tripTitle.includes("Refined")
    ? cloned.tripTitle
    : `${cloned.tripTitle} (Refined)`;

  return cloned;
}

const refineItinerary = async ({ currentItinerary, instruction }) => {
  const prompt = refinerPrompt
    .replace("{instruction}", instruction)
    .replace("{currentItinerary}", JSON.stringify(currentItinerary, null, 2));

  try {
    const llm = getGroqClient();
    if (!llm) {
      console.warn("GROQ_API_KEY inactive. Applying smart local refinement fallback.");
      const fallback = fallbackRefine(currentItinerary, instruction);
      return itinerarySchema.parse(fallback);
    }

    console.log("Refining itinerary with instruction:", instruction);
    const response = await llm.invoke(prompt);

    const jsonString = extractJson(response.content);
    const parsed = JSON.parse(jsonString);
    return itinerarySchema.parse(parsed);

  } catch (error) {
    console.warn("Refiner LLM error:", error.message);
    const fallback = fallbackRefine(currentItinerary, instruction);
    return itinerarySchema.parse(fallback);
  }
};

module.exports = refineItinerary;
