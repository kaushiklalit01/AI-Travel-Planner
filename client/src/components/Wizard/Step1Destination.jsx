import { MapPin, Search, Sparkles } from "lucide-react";

const POPULAR_DESTINATIONS = [
  { name: "Goa, India", tag: "Beach & Nightlife", emoji: "🏖️" },
  { name: "Manali, Himachal", tag: "Mountains & Snow", emoji: "🏔️" },
  { name: "Ladakh, India", tag: "High-Altitude & Treks", emoji: "🏍️" },
  { name: "Kerala, India", tag: "Backwaters & Ayurveda", emoji: "🌴" },
  { name: "Jaipur, Rajasthan", tag: "Palaces & Forts", emoji: "🏰" },
  { name: "Rishikesh, Uttarakhand", tag: "Yoga & River Rafting", emoji: "🧘" },
  { name: "Bali, Indonesia", tag: "Tropical & Temples", emoji: "🌺" },
  { name: "Kyoto, Japan", tag: "Culture & Cherry Blossoms", emoji: "⛩️" },
];

export default function Step1Destination({ value, onChange, onNext }) {
  const handleSelect = (destName) => {
    onChange(destName);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Where is your next adventure?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Enter any city, region, trek trail, or country you want to explore.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600">
            <MapPin className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Manali, Himachal Pradesh or Kyoto, Japan"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-base sm:text-lg font-medium text-slate-800 placeholder:text-slate-400 shadow-sm"
            autoFocus
          />
        </div>
      </div>

      {/* Popular Suggestions */}
      <div className="max-w-2xl mx-auto pt-2">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Popular Travel Hotspots</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {POPULAR_DESTINATIONS.map((dest) => {
            const isSelected = value.toLowerCase() === dest.name.toLowerCase();
            return (
              <button
                type="button"
                key={dest.name}
                onClick={() => handleSelect(dest.name)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 text-emerald-900 shadow-sm"
                    : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <span className="text-xl mb-1">{dest.emoji}</span>
                <span className="font-semibold text-xs sm:text-sm line-clamp-1">
                  {dest.name}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  {dest.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
