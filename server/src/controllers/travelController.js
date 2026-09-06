const generateTravelPlan = require("../Agents/plannerAgent");
const getDestinationImages = require("../services/imageService");
const getWeather = require("../services/weatherService");

const healthCheck = async (req, res) => {
  res.json({
    success: true,
    message: "AI Travel Planner Backend Running 🚀",
  });
};

const planTrip = async (req, res) => {
  try {
    const { destination } = req.body;

    const itinerary = await generateTravelPlan(req.body);

    const destinationImages = await getDestinationImages(destination);
    const weather = await getWeather(destination);

    console.log("Destination images:", destinationImages);
    console.log("Weather:", weather);

   res.status(200).json({
  success: true,
  itinerary,
  destinationImages,
  weather,
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
