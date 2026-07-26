import TripHeader from "./TripHeader";
import DayCard from "./DayCard";
import BudgetCard from "./BudgetCard";
import TravelTips from "./TravelTips";
import { useState } from "react";
import { Plane } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";
import api from "../../services/api";

export default function TravelForm() {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
    interests: "",
  });

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");

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
    } catch (err) {
      console.error(err);
      alert("Failed to generate itinerary");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      <Card>

        <div className="flex items-center gap-3 mb-6">

          <Plane className="text-blue-600" size={35} />

          <div>
            <h1 className="text-3xl font-bold">
              AI Travel Planner
            </h1>

            <p className="text-gray-500">
              Plan your perfect vacation with AI
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <Input
            label="Destination"
            name="destination"
            placeholder="Goa"
            value={formData.destination}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-5">

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
            🚀 Generate Travel Plan
          </Button>

        </form>

      </Card>

      {itinerary && (
  <Card>
    <TripHeader itinerary={itinerary} />

    <div className="space-y-6">
      {itinerary.days.map((day) => (
        <DayCard key={day.day} day={day} />
      ))}
    </div>

    <BudgetCard budget={itinerary.budget} />

    <TravelTips tips={itinerary.travelTips} />
  </Card>
)}

    </div>
  );
}