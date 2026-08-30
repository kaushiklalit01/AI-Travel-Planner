const axios = require("axios");

const getDestinationImages = async (destination) => {
  try {
    const response = await axios.get(
      "https://api.pexels.com/v1/search",
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
        params: {
          query: `${destination} travel`,
          orientation: "landscape",
          per_page: 5,
        },
      }
    );

    const photos = response.data.photos || [];

    if (photos.length === 0) {
      console.log("No Pexels photos found for:", destination);
      return [];
    }

    return photos.map((photo) => ({
      imageUrl: photo.src.large2x || photo.src.landscape,
      photoUrl: photo.url,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
    }));
  } catch (error) {
    console.error(
      "Pexels API error:",
      error.response?.data || error.message
    );

    return [];
  }
};

module.exports = getDestinationImages;