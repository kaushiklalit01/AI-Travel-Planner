import { Plane } from "lucide-react";

export default function Hero() {
  return (
    <div className="text-center mb-10">

      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-5">
        <Plane size={40} className="text-blue-600" />
      </div>

      <h1 className="text-5xl font-extrabold text-gray-800">
        AI Travel Planner
      </h1>

      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Plan your perfect vacation with the power of AI.
        Get personalized itineraries, budgets and travel tips in seconds.
      </p>

    </div>
  );
}