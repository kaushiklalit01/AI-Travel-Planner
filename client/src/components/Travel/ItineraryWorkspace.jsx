import { useState } from "react";
import DayTabs from "./DayTabs";
import ActivityCard from "./ActivityCard";
import DailyDiningCard from "./DailyDiningCard";
import HotelOptionsPanel from "./HotelOptionsPanel";
import WarningsPanel from "./WarningsPanel";
import BudgetBreakdown from "./BudgetBreakdown";
import DestinationImage from "./DestinationImage";
import WeatherCard from "./WeatherCard";
import TravelTips from "./TravelTips";
import TripMap from "./TripMap";
import TripChatDrawer from "./TripChatDrawer";
import { Sparkles, Calendar, MapPin, Compass, Map as MapIcon, List } from "lucide-react";

export default function ItineraryWorkspace({
  itinerary: initialItinerary,
  destinationImages = [],
  weather = null,
  tripId = null,
  onItineraryUpdated,
}) {
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [activeTab, setActiveTab] = useState(1);
  const [showMap, setShowMap] = useState(true);

  // Sync internal state if initialItinerary changes
  if (initialItinerary && initialItinerary !== itinerary && !itinerary.tripTitle.includes("(Refined)")) {
    setItinerary(initialItinerary);
  }

  const handleItineraryRefined = (newItinerary) => {
    setItinerary(newItinerary);
    if (onItineraryUpdated) {
      onItineraryUpdated(newItinerary);
    }
  };

  if (!itinerary || !itinerary.days) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-slate-200">
        No itinerary days to display.
      </div>
    );
  }

  const daysToShow =
    activeTab === "all"
      ? itinerary.days
      : itinerary.days.filter((d) => d.day === activeTab);

  // Collect activities for the map
  const activeActivities =
    activeTab === "all"
      ? itinerary.days.flatMap((d) => d.activities || [])
      : itinerary.days.find((d) => d.day === activeTab)?.activities || [];

  return (
    <div className="space-y-8 animate-fadeIn relative">
      {/* Top Workspace Controls: Day Tabs + Map Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <DayTabs
            days={itinerary.days}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all self-start sm:self-auto mb-6 sm:mb-0 ${
            showMap
              ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <MapIcon className="w-4 h-4 text-emerald-600" />
          <span>{showMap ? "Hide Route Map" : "Show Route Map"}</span>
        </button>
      </div>

      {/* Interactive Map (if enabled) */}
      {showMap && (
        <TripMap
          activities={activeActivities}
          destination={itinerary.destination || "Trip Destination"}
          dayTitle={activeTab === "all" ? "All Days Overview" : `Day ${activeTab}`}
        />
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Itinerary Day Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {daysToShow.map((day) => (
            <div
              key={day.day}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6"
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                      Day {day.day}
                    </span>
                    {day.theme && (
                      <span className="text-xs font-semibold text-slate-500">
                        • {day.theme}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {day.title}
                  </h3>
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  {day.activities?.length || 0} Activities Planned
                </span>
              </div>

              {/* Day Activities List */}
              <div className="space-y-4">
                {day.activities?.map((activity, idx) => (
                  <ActivityCard key={idx} activity={activity} index={idx} />
                ))}
              </div>

              {/* Day Dining Recommendation */}
              {day.restaurantSuggestion && (
                <DailyDiningCard restaurant={day.restaurantSuggestion} />
              )}
            </div>
          ))}

          {/* Travel Tips at bottom of schedule */}
          {itinerary.travelTips && itinerary.travelTips.length > 0 && (
            <TravelTips tips={itinerary.travelTips} />
          )}
        </div>

        {/* Right Column: Context Panels (Budget, Weather, Hotels, Warnings, Visuals) */}
        <div className="space-y-6">
          {/* Destination Visual Gallery */}
          {destinationImages && destinationImages.length > 0 && (
            <DestinationImage images={destinationImages} />
          )}

          {/* Destination Weather Forecast & Advisory */}
          {weather && <WeatherCard weather={weather} />}

          {/* Detailed Budget Breakdown */}
          {itinerary.budget && (
            <BudgetBreakdown
              budget={itinerary.budget}
              totalDays={itinerary.days?.length || 1}
            />
          )}

          {/* Hotel Recommendations */}
          {itinerary.hotelSuggestions && itinerary.hotelSuggestions.length > 0 && (
            <HotelOptionsPanel hotels={itinerary.hotelSuggestions} />
          )}

          {/* Warnings & Smart Alternatives */}
          {itinerary.warningsAndAlternatives && itinerary.warningsAndAlternatives.length > 0 && (
            <WarningsPanel warnings={itinerary.warningsAndAlternatives} />
          )}
        </div>
      </div>

      {/* Floating AI Chat / Refinement Drawer */}
      <TripChatDrawer
        tripId={tripId}
        currentItinerary={itinerary}
        onItineraryRefined={handleItineraryRefined}
      />
    </div>
  );
}
