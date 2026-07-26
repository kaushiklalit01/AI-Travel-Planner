const planTrip = async (req, res) => {
  try {
    const { destination, days, budget, interests } = req.body;

    if (!destination || !days || !budget || !interests) {
      return res.status(400).json({
        success: false,
        message: "Please provide destination, days, budget and interests"
      });
    }

    const itinerary = await generateTravelPlan(req.body);

    res.json({
      success: true,
      itinerary
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};