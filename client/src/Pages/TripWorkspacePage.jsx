import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, IndianRupee, MapPin, Share2, Printer, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import TripHeader from "../components/Travel/TripHeader";
import DestinationImage from "../components/Travel/DestinationImage";
import WeatherCard from "../components/Travel/WeatherCard";
import BudgetCard from "../components/Travel/BudgetCard";
import Itinerary from "../components/Travel/Itinerary";
import TravelTips from "../components/Travel/TravelTips";

export default function TripWorkspacePage() {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(location.state?.trip || null);

  useEffect(() => {
    if (!trip && tripId) {
      try {
        const saved = JSON.parse(localStorage.getItem("itinera_saved_trips") || "[]");
        const found = saved.find((t) => t.id === tripId);
        if (found) {
          setTrip(found);
        }
      } catch (e) {
        console.warn("Could not find trip:", e);
      }
    }
  }, [tripId, trip]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Trip link copied to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  if (!trip || !trip.data) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Trip Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            We couldn't locate this trip in your browser storage. You can view your saved trips or plan a new adventure.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/plan"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Plan New Trip
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { itinerary, destinationImages, weather } = trip.data;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
        {/* Workspace Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Saved Trips</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share Link</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Trip Title & Header */}
        {itinerary && <TripHeader itinerary={itinerary} />}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Schedule & Tips */}
          <div className="lg:col-span-2 space-y-6">
            {itinerary?.days && <Itinerary days={itinerary.days} />}
            {itinerary?.travelTips && <TravelTips tips={itinerary.travelTips} />}
          </div>

          {/* Right Column: Visuals, Weather & Budget */}
          <div className="space-y-6">
            {destinationImages && destinationImages.length > 0 && (
              <DestinationImage images={destinationImages} />
            )}

            {weather && <WeatherCard weather={weather} />}

            {itinerary?.budget && <BudgetCard budget={itinerary.budget} />}
          </div>
        </div>
      </div>
    </div>
  );
}
