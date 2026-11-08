import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import TripWizard from "../components/Wizard/TripWizard";
import TripHeader from "../components/Travel/TripHeader";
import DestinationImage from "../components/Travel/DestinationImage";
import WeatherCard from "../components/Travel/WeatherCard";
import BudgetCard from "../components/Travel/BudgetCard";
import Itinerary from "../components/Travel/Itinerary";
import TravelTips from "../components/Travel/TravelTips";

export default function PlanWizardPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialDest = searchParams.get("dest") || "";

  const [tripResult, setTripResult] = useState(null);
  const [preferences, setPreferences] = useState(null);

  const handlePlanGenerated = (data, userPreferences) => {
    setTripResult(data);
    setPreferences(userPreferences);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Store in recent trips in localStorage for the Dashboard
    try {
      const recentTrips = JSON.parse(localStorage.getItem("itinera_saved_trips") || "[]");
      const newTrip = {
        id: "trip_" + Date.now(),
        destination: userPreferences.destination,
        days: userPreferences.days,
        budget: userPreferences.budget,
        createdAt: new Date().toISOString(),
        title: data.itinerary?.tripTitle || `${userPreferences.days}-Day ${userPreferences.destination} Trip`,
        data: data,
        preferences: userPreferences,
      };
      localStorage.setItem("itinera_saved_trips", JSON.stringify([newTrip, ...recentTrips.slice(0, 9)]));
    } catch (e) {
      console.warn("Could not save to recent trips:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {!tripResult ? (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100/70 text-emerald-800 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Step-by-Step Trip Builder
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Design Your Personalized Trip
              </h1>
              <p className="mt-2 text-slate-500 text-sm sm:text-base">
                Follow our 5-step planner to customize your destination, dates, companions, vibe, and budget.
              </p>
            </div>

            <TripWizard
              initialDestination={initialDest}
              onPlanGenerated={handlePlanGenerated}
            />
          </div>
        ) : (
          /* Generated Itinerary Result Workspace View */
          <div className="space-y-8 animate-fadeIn">
            {/* Header & Back Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setTripResult(null)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Plan Another Trip / Edit Inputs</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                >
                  View in Saved Trips
                </button>
              </div>
            </div>

            {/* Trip Header */}
            {tripResult.itinerary && (
              <TripHeader itinerary={tripResult.itinerary} />
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Day-by-Day Itinerary */}
              <div className="lg:col-span-2 space-y-6">
                {tripResult.itinerary?.days && (
                  <Itinerary days={tripResult.itinerary.days} />
                )}

                {tripResult.itinerary?.travelTips && (
                  <TravelTips tips={tripResult.itinerary.travelTips} />
                )}
              </div>

              {/* Right Column: Destination Visuals, Weather & Budget */}
              <div className="space-y-6">
                {tripResult.destinationImages && tripResult.destinationImages.length > 0 && (
                  <DestinationImage images={tripResult.destinationImages} />
                )}

                {tripResult.weather && (
                  <WeatherCard weather={tripResult.weather} />
                )}

                {tripResult.itinerary?.budget && (
                  <BudgetCard budget={tripResult.itinerary.budget} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
