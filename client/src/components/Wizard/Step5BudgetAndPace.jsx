import { useState } from "react";
import { IndianRupee, Gauge, Tag, Plus, X } from "lucide-react";

const BUDGET_TIERS = [
  {
    id: "Budget",
    title: "Backpacker / Budget",
    desc: "Hostels, street food & public transport",
    estimate: 15000,
    emoji: "🪙",
  },
  {
    id: "Moderate",
    title: "Moderate / Standard",
    desc: "Comfortable 3-4★ hotels, cabs & local tours",
    estimate: 35000,
    emoji: "💳",
  },
  {
    id: "Luxury",
    title: "Luxury / Premium",
    desc: "5★ resorts, private transfers & fine dining",
    estimate: 75000,
    emoji: "👑",
  },
];

const PACES = [
  { id: "Relaxed", label: "Relaxed", desc: "1-2 activities/day, plenty of downtime" },
  { id: "Balanced", label: "Balanced", desc: "3-4 activities/day with comfortable pacing" },
  { id: "Fast-Paced", label: "Packed", desc: "Maximize your trip, see as much as possible" },
];

const SUGGESTED_INTERESTS = [
  "Local Street Food",
  "Sunset Viewpoints",
  "Hiking Trails",
  "Cafes with Views",
  "Heritage Temples",
  "Beaches & Water Sports",
  "Photography Spots",
  "Shopping Local Bazaars",
];

export default function Step5BudgetAndPace({
  budgetTier,
  budgetAmount,
  pace,
  interests,
  specialRequests,
  onChangeBudgetTier,
  onChangeBudgetAmount,
  onChangePace,
  onAddInterest,
  onRemoveInterest,
  onChangeSpecialRequests,
}) {
  const [newTagInput, setNewTagInput] = useState("");

  const handleAddTag = (e) => {
    e?.preventDefault();
    const tag = newTagInput.trim();
    if (tag && !interests.includes(tag)) {
      onAddInterest(tag);
      setNewTagInput("");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Budget, pace & must-do interests
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          The final details to ensure the plan fits your wallet and travel tempo.
        </p>
      </div>

      {/* Budget Tier */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          1. Budget Style & Estimated Spend
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {BUDGET_TIERS.map((tier) => {
            const isSelected = budgetTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => {
                  onChangeBudgetTier(tier.id);
                  if (!budgetAmount || budgetAmount === 0) {
                    onChangeBudgetAmount(tier.estimate);
                  }
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/10 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{tier.emoji}</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    {tier.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {tier.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Total Budget Input */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Estimated Total Budget (INR)
            </span>
            <input
              type="number"
              value={budgetAmount || ""}
              onChange={(e) => onChangeBudgetAmount(Number(e.target.value))}
              placeholder="e.g. 30000"
              className="w-full text-base font-bold text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Pace Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          2. Travel Pace
        </label>
        <div className="grid grid-cols-3 gap-3">
          {PACES.map((p) => {
            const isSelected = pace === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChangePace(p.id)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/10 text-emerald-900 font-bold shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="block text-xs sm:text-sm font-bold">{p.label}</span>
                <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5">{p.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Must-Do Interests Tags */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          3. Specific Interests & Must-Dos
        </label>

        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {interests.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 font-semibold text-xs border border-emerald-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveInterest(tag)}
                className="hover:text-emerald-950"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {/* Quick Add Suggested Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {SUGGESTED_INTERESTS.filter((t) => !interests.includes(t)).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onAddInterest(item)}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              + {item}
            </button>
          ))}
        </div>

        {/* Custom Tag Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
            placeholder="Add custom interest (e.g. Scuba, Paragliding, Craft Beer)..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-3.5 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-900 active:scale-95 transition-all"
          >
            Add
          </button>
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          4. Any Special Requests or Dietary Preferences? (Optional)
        </label>
        <textarea
          rows={2}
          value={specialRequests || ""}
          onChange={(e) => onChangeSpecialRequests(e.target.value)}
          placeholder="e.g. Vegetarian food only, early morning flights, renting a two-wheeler, senior citizen friendly..."
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-slate-800"
        />
      </div>
    </div>
  );
}
