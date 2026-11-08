import { Calendar, Plus, Minus, Sun, CloudRain, Snowflake, Leaf } from "lucide-react";

const QUICK_DURATIONS = [3, 4, 5, 7, 10, 14];

const SEASONS = [
  { id: "summer", name: "Summer", icon: Sun, months: "Mar - Jun" },
  { id: "monsoon", name: "Monsoon", icon: CloudRain, months: "Jul - Sep" },
  { id: "autumn", name: "Autumn", icon: Leaf, months: "Oct - Nov" },
  { id: "winter", name: "Winter", icon: Snowflake, months: "Dec - Feb" },
];

export default function Step2Dates({
  days,
  startDate,
  endDate,
  season,
  onChangeDays,
  onChangeStartDate,
  onChangeEndDate,
  onChangeSeason,
}) {
  const handleDecrement = () => {
    if (days > 1) onChangeDays(days - 1);
  };

  const handleIncrement = () => {
    if (days < 30) onChangeDays(days + 1);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How long and when are you travelling?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Pick your trip length so our AI can curate an optimal day-by-day pacing.
        </p>
      </div>

      {/* Days Counter */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
          Trip Duration (Days)
        </label>

        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={days <= 1}
            className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-700 hover:border-emerald-600 hover:text-emerald-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Minus className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {days}
            </span>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mt-1">
              {days === 1 ? "Day Trip" : `${days} Days / ${days - 1} Nights`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={days >= 30}
            className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-700 hover:border-emerald-600 hover:text-emerald-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Quick Duration Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
          {QUICK_DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onChangeDays(d)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                days === d
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Specific Dates (Optional) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Travel Dates (Optional)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => onChangeStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => onChangeEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Season Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
          Preferred Season / Weather Vibe
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SEASONS.map((s) => {
            const Icon = s.icon;
            const isSelected = season === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChangeSeason(s.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 text-emerald-900"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
                <span className="block font-semibold text-xs">{s.name}</span>
                <span className="text-[10px] text-slate-400">{s.months}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
