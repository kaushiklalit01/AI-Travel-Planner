const { ChatGroq } = require("@langchain/groq");
const plannerPrompt = require("../prompts/plannerPrompt");
const { itinerarySchema } = require("../schemas/itinerarySchema");
const extractJson = require("../utils/extractJson");

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
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

  try {
    // Ask AI to generate the travel plan
    const response = await llm.invoke(prompt);

    // Show the raw AI response in terminal
    console.log("=================================");
    console.log("AI RAW RESPONSE:");
    console.log(response.content);
    console.log("=================================");

    // Extract JSON from AI response
    const jsonString = extractJson(response.content);

    console.log("EXTRACTED JSON:");
    console.log(jsonString);
    console.log("=================================");

    // Show the part around the possible error
    console.log("JSON LENGTH:", jsonString.length);
    console.log("JSON AROUND ERROR AREA:");
    console.log("JSON AROUND ERROR AREA:");
    console.log(jsonString.substring(1150, 1300));
    console.log("=================================");

    // Convert JSON string into JavaScript object
    const parsedResponse = JSON.parse(jsonString);

    // Validate response using Zod schema
    const validatedResponse = itinerarySchema.parse(parsedResponse);

    return validatedResponse;

  } catch (error) {
    console.error("=================================");
    console.error("ERROR GENERATING TRAVEL PLAN:");
    console.error(error);
    console.error("=================================");

    throw new Error(
      "The AI returned an invalid itinerary. Please try again."
    );
  }
};

module.exports = generateTravelPlan;