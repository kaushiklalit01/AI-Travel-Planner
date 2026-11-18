import { Sun, SunMedium, Sunset, Moon, Clock, MapPin, IndianRupee, Lightbulb } from "lucide-react";

export default function ActivityCard({ activity, index }) {
  const getSlotConfig = (slot) => {
    const s = (slot || "").toLowerCase();
    if (s.includes("morning")) {
      return {
        icon: Sun,
        badgeBg: "bg-amber-100/80 text-amber-900 border-amber-200",
        accentBorder: "border-l-amber-500",
        iconColor: "text-amber-600",
      };
    }
    if (s.includes("afternoon")) {
      return {
        icon: SunMedium,
        badgeBg: "bg-sky-100/80 text-sky-900 border-sky-200",
        accentBorder: "border-l-sky-500",
        iconColor: "text-sky-600",
      };
    }
    if (s.includes("evening")) {
      return {
        icon: Sunset,
        badgeBg: "bg-purple-100/80 text-purple-900 border-purple-200",
        accentBorder: "border-l-purple-500",
        iconColor: "text-purple-600",
      };
    }
    return {
      icon: Moon,
      badgeBg: "bg-slate-200 text-slate-800 border-slate-300",
      accentBorder: "border-l-slate-600",
      iconColor: "text-slate-600",
    };
  };

  const slotConfig = getSlotConfig(activity.timeSlot);
  const SlotIcon = slotConfig.icon;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 border-l-4 ${slotConfig.accentBorder} space-y-3.5`}
    >
      {/* Top Header: Time Slot & Time */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${slotConfig.badgeBg}`}
          >
            <SlotIcon className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{activity.timeSlot || "Scheduled"}</span>
          </span>

          <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{activity.time}</span>
          </span>
        </div>

        {/* Duration & Cost */}
        <div className="flex items-center gap-2 text-xs">
          {activity.duration && (
            <span className="text-slate-500 font-medium">
              ⏱️ {activity.duration}
            </span>
          )}

          {activity.estimatedCost !== undefined && activity.estimatedCost > 0 && (
            <span className="inline-flex items-center font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <IndianRupee className="w-3 h-3" />
              <span>~{activity.estimatedCost}</span>
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
          {activity.title || activity.activity}
        </h4>
        {activity.description && (
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {activity.description}
          </p>
        )}
      </div>

      {/* Location Landmark & Geo Coordinates */}
      {(activity.locationName || activity.latitude) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {activity.locationName && (
            <span className="inline-flex items-center gap-1 text-slate-700 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{activity.locationName}</span>
            </span>
          )}

          {activity.latitude && activity.longitude && (
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              📍 {activity.latitude.toFixed(2)}, {activity.longitude.toFixed(2)}
            </span>
          )}
        </div>
      )}

      {/* Local Travel Notes / Insider Tip */}
      {activity.travelNotes && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 flex items-start gap-2 text-xs text-amber-900">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="leading-snug">{activity.travelNotes}</span>
        </div>
      )}
    </div>
  );
}
