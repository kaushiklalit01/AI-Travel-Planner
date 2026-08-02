import { MapPin, CalendarDays, Sparkles } from "lucide-react";

export default function TripHeader({ itinerary }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl text-white p-8 shadow-xl">

      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={22} />
        <span className="font-medium">
          AI Generated Itinerary
        </span>
      </div>

      <h1 className="text-4xl font-extrabold mb-4">
        {itinerary.tripTitle}
      </h1>

      <p className="text-blue-100 leading-7 mb-6">
        {itinerary.summary}
      </p>

      <div className="flex flex-wrap gap-6">

        <div className="flex items-center gap-2">
          <CalendarDays size={20} />
          <span>{itinerary.days.length} Days</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={20} />
          <span>AI Planned Journey</span>
        </div>

      </div>

    </div>
  );
}