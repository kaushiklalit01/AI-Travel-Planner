const { ChatGroq } = require("@langchain/groq");
const plannerPrompt = require("../prompts/plannerPrompt");
const { itinerarySchema } = require("../schemas/itinerarySchema");
const extractJson = require("../utils/extractJson");
const generateFallbackPlan = require("./fallbackPlanner");

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes("your_")) {
    return null;
  }
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    temperature: 0.5,
  });
};

const generateTravelPlan = async ({
  destination,
  days,
  budget,
  interests,
}) => {
  const formattedInterests = Array.isArray(interests)
    ? interests.join(", ")
    : String(interests || "sightseeing, local food, culture");

  const prompt = plannerPrompt
    .replace(/{destination}/g, destination)
    .replace(/{days}/g, days)
    .replace(/{budget}/g, budget)
    .replace(/{interests}/g, formattedInterests);

  try {
    const llm = getGroqClient();
    if (!llm) {
      console.warn("GROQ_API_KEY not configured or placeholder detected. Using intelligent fallback planner.");
      const fallback = generateFallbackPlan({ destination, days, budget, interests });
      return itinerarySchema.parse(fallback);
    }

    console.log("Invoking Groq LLM for destination:", destination);
    const response = await llm.invoke(prompt);

    const jsonString = extractJson(response.content);
    const parsedResponse = JSON.parse(jsonString);

    // Validate against strict Zod schema
    const validatedResponse = itinerarySchema.parse(parsedResponse);
    return validatedResponse;

  } catch (error) {
    console.warn("Notice: Groq LLM call failed or returned unparseable content:", error.message);
    console.log("Generating smart schema-compliant itinerary fallback for demo resilience...");

    // Resilience fallback so demo & local testing never stall
    const fallback = generateFallbackPlan({ destination, days, budget, interests });
    return itinerarySchema.parse(fallback);
  }
};

module.exports = generateTravelPlan;
