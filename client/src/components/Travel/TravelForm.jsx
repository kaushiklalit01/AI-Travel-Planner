import { useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";

import api from "../../services/api";

import Itinerary from "./Itinerary";
import Hero from "./Hero";
import DestinationImage from "./DestinationImage";
import WeatherCard from "./WeatherCard";

export default function TravelForm() {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
    interests: "",
  });

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [destinationImage, setDestinationImage] = useState(null);
  const [weather, setWeather] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post("/travel/plan", {
        destination: formData.destination,
        days: Number(formData.days),
        budget: Number(formData.budget),
        interests: formData.interests
          .split(",")
          .map((i) => i.trim()),
      });

      setItinerary(res.data.itinerary);
      setDestinationImage(res.data.destinationImage);
      setWeather(res.data.weather);

      console.log(res.data.destinationImage);
      console.log(res.data.itinerary);
      console.log(res.data.weather);
    } catch (err) {
      console.error(err);
      alert("Failed to generate itinerary");
    }

    setLoading(false);
  };

  return (
    <div className="w-full">

      {/* ================= FORM ================= */}

      <Hero>

  <form onSubmit={handleSubmit}>

    <Input
      label="Destination"
      name="destination"
      placeholder="Goa"
      value={formData.destination}
      onChange={handleChange}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      <Input
        label="Days"
        type="number"
        name="days"
        placeholder="3"
        value={formData.days}
        onChange={handleChange}
      />

      <Input
        label="Budget"
        type="number"
        name="budget"
        placeholder="50000"
        value={formData.budget}
        onChange={handleChange}
      />

    </div>

    <Input
      label="Interests"
      name="interests"
      placeholder="Beach, Adventure, Nature"
      value={formData.interests}
      onChange={handleChange}
    />

    <Button loading={loading}>
       Generate Travel Plan
    </Button>

  </form>

</Hero>


      {/* ================= RESULTS ================= */}

      {itinerary && (

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= LEFT : ITINERARY ================= */}

          <div className="lg:col-span-2">

            <Card>

              <Itinerary itinerary={itinerary} />

            </Card>

          </div>


          {/* ================= RIGHT : SIDEBAR ================= */}

          <div className="space-y-6">

            {/* WEATHER */}

            {weather && (
              <WeatherCard weather={weather} />
            )}


            {/* DESTINATION IMAGE */}

            {destinationImage && (
              <Card>

                <DestinationImage
                  image={destinationImage}
                />

              </Card>
            )}

          </div>

          </div>
        </div>

      )}

    </div>
  );
}
