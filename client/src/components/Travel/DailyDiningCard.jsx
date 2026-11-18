import { Utensils, Star, Sparkles } from "lucide-react";

export default function DailyDiningCard({ restaurant }) {
  if (!restaurant || !restaurant.name) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50/80 to-amber-50/80 border border-orange-200/80 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
            Recommended Daily Dining
          </span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-orange-800 border border-orange-200">
          {restaurant.priceRange || "₹₹"}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
        <div>
          <h5 className="font-bold text-sm sm:text-base text-slate-900">
            {restaurant.name}
          </h5>
          <span className="text-xs text-slate-500">{restaurant.cuisine}</span>
        </div>

        {restaurant.recommendedDish && (
          <div className="bg-white/90 border border-orange-100 rounded-xl px-3 py-1.5 text-xs text-orange-950 font-medium">
            <span className="text-slate-400 font-normal mr-1">Must Try:</span>
            <strong>{restaurant.recommendedDish}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
