const planTrip = async (req, res) => {
  try {
    const { destination } = req.body;

    const itinerary = await generateTravelPlan(req.body);

    const destinationImage = await getDestinationImage(destination);
    const weather = await getWeather(destination);

    res.status(200).json({
      success: true,
      itinerary,
      destinationImage,
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