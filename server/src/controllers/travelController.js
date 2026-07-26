const generateTravelPlan = require("../agents/plannerAgent");

const healthCheck = async (req, res) => {
  res.json({
    success: true,
    message: "AI Travel Planner Backend Running 🚀",
  });
};

const planTrip = async (req, res) => {
  try {
    const itinerary = await generateTravelPlan(req.body);

    res.status(200).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  healthCheck,
  planTrip,
};