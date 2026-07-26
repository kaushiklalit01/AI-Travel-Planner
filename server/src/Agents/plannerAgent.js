const { ChatGroq } = require("@langchain/groq");
const plannerPrompt = require("../prompts/plannerPrompt");
const { itinerarySchema } = require("../schemas/itinerarySchema");
const extractJson = require("../utils/extractJson");

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

const generateTravelPlan = async ({
  destination,
  days,
  budget,
  interests,
}) => {
  const prompt = plannerPrompt
    .replace("{destination}", destination)
    .replace("{days}", days)
    .replace("{budget}", budget)
    .replace("{interests}", interests.join(", "));

  const response = await llm.invoke(prompt);

  try {
    // Convert AI response string to JavaScript object
    const jsonString = extractJson(response.content);

    const parsedResponse = JSON.parse(jsonString);

    // Validate against our schema
    const validatedResponse = itinerarySchema.parse(parsedResponse);

    return validatedResponse;
  } catch (error) {
    console.error("Error parsing AI response:", error);

    throw new Error(
      "The AI returned an invalid itinerary. Please try again."
    );
  }
};

module.exports = generateTravelPlan;