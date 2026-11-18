import { MapPin, CalendarDays, Sparkles, Compass, IndianRupee } from "lucide-react";

export default function TripHeader({ itinerary }) {
  const daysCount = itinerary.days?.length || 0;
  const totalBudget =
    itinerary.budget?.hotel +
    itinerary.budget?.food +
    itinerary.budget?.transport +
    itinerary.budget?.activities +
    itinerary.budget?.misc;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Curated Travel Workspace
          </span>

          {itinerary.bestTimeToVisit && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/10 px-3 py-1 rounded-full">
              🌤️ Best Time: {itinerary.bestTimeToVisit}
            </span>
          )}
        </div>

        {/* Title & Summary */}
        <div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {itinerary.tripTitle}
          </h1>

          {itinerary.summary && (
            <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-3xl">
              {itinerary.summary}
            </p>
          )}
        </div>

        {/* Quick Meta Pills */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200">
          <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm">
            <CalendarDays className="w-4 h-4 text-emerald-400" />
            <span>{daysCount} Days Planned</span>
          </div>

          {itinerary.destination && (
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{itinerary.destination}</span>
            </div>
          )}

          {totalBudget > 0 && (
            <div className="flex items-center gap-1.5 bg-emerald-500/20 px-3.5 py-1.5 rounded-xl text-emerald-300 border border-emerald-500/30">
              <IndianRupee className="w-4 h-4" />
              <span>Est. Budget: ₹{totalBudget.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
