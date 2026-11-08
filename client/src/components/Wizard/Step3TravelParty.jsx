import { User, Heart, Users, Compass, Plus, Minus } from "lucide-react";

const PARTY_TYPES = [
  {
    id: "Solo",
    title: "Solo Explorer",
    subtitle: "Just you, full freedom and flexibility",
    defaultCount: 1,
    icon: Compass,
    emoji: "🎒",
  },
  {
    id: "Couple",
    title: "Couple / Romantic",
    subtitle: "Scenic spots, charming dining & shared memories",
    defaultCount: 2,
    icon: Heart,
    emoji: "🥂",
  },
  {
    id: "Family",
    title: "Family Vacation",
    subtitle: "Kid-friendly activities, safety & relaxed pace",
    defaultCount: 4,
    icon: Users,
    emoji: "👨‍👩‍👧‍👦",
  },
  {
    id: "Friends",
    title: "Friends / Group",
    subtitle: "Adventure, night-outs, group activities & fun",
    defaultCount: 4,
    icon: User,
    emoji: "🎉",
  },
];

export default function Step3TravelParty({
  partyType,
  travelerCount,
  onChangePartyType,
  onChangeCount,
}) {
  const handleSelectType = (typeObj) => {
    onChangePartyType(typeObj.id);
    if (!travelerCount || travelerCount <= 1) {
      onChangeCount(typeObj.defaultCount);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Who is joining the trip?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          This helps our AI recommend suitable stays, restaurants, and group activities.
        </p>
      </div>

      {/* Party Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {PARTY_TYPES.map((item) => {
          const isSelected = partyType === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectType(item)}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.98] ${
                isSelected
                  ? "bg-emerald-50/80 border-emerald-600 ring-4 ring-emerald-600/10 shadow-sm"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.emoji}</span>
                <span className="font-bold text-base text-slate-900">
                  {item.title}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Number of Travelers Counter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-sm text-slate-900 block">
            Exact Number of Travelers
          </span>
          <span className="text-xs text-slate-400">
            For hotel room planning and activity booking estimates
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChangeCount(Math.max(1, travelerCount - 1))}
            disabled={travelerCount <= 1}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-emerald-600 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>
          <span className="text-xl font-bold text-slate-900 w-8 text-center">
            {travelerCount}
          </span>
          <button
            type="button"
            onClick={() => onChangeCount(travelerCount + 1)}
            disabled={travelerCount >= 20}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-emerald-600 active:scale-95 disabled:opacity-30"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
