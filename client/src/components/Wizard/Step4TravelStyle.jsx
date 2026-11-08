import { Check } from "lucide-react";

const STYLES = [
  { id: "adventure", label: "Adventure & Hiking", emoji: "🧗", desc: "Trails, outdoors & thrill" },
  { id: "relaxed", label: "Relaxed & Leisure", emoji: "🏖️", desc: "Cafes, beaches & slow mornings" },
  { id: "culture", label: "Culture & Heritage", emoji: "🏛️", desc: "Museums, temples & historical sites" },
  { id: "foodie", label: "Foodie & Culinary", emoji: "🍜", desc: "Street food, fine dining & local flavours" },
  { id: "nature", label: "Nature & Wildlife", emoji: "🌿", desc: "National parks, waterfalls & valleys" },
  { id: "nightlife", label: "Nightlife & City Vibes", emoji: "🍸", desc: "Clubs, rooftop bars & vibrant scenes" },
  { id: "spiritual", label: "Spiritual & Wellness", emoji: "🧘", desc: "Yoga, ashrams & meditation retreats" },
  { id: "photography", label: "Scenic & Photography", emoji: "📸", desc: "Iconic viewpoints & photo spots" },
];

export default function Step4TravelStyle({ selectedStyles, onToggleStyle }) {
  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          What is your travel style?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Select one or more vibes to personalize your day-by-day experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STYLES.map((style) => {
          const isSelected = selectedStyles.includes(style.label);
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onToggleStyle(style.label)}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all duration-150 active:scale-[0.98] ${
                isSelected
                  ? "bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/10 shadow-sm"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="text-2xl">{style.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">
                    {style.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{style.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center text-xs text-slate-400">
        💡 Tip: You can select multiple styles to blend hiking, local food, and leisure!
      </div>
    </div>
  );
}
