import { Hotel, Utensils, Car, Ticket, Wallet, IndianRupee } from "lucide-react";

export default function BudgetBreakdown({ budget, totalDays = 1 }) {
  if (!budget) return null;

  const hotel = budget.hotel || 0;
  const food = budget.food || 0;
  const transport = budget.transport || 0;
  const activities = budget.activities || 0;
  const misc = budget.misc || 0;

  const total = hotel + food + transport + activities + misc;
  const perDay = totalDays > 0 ? Math.round(total / totalDays) : total;

  const categories = [
    { name: "Stay / Hotel", amount: hotel, icon: Hotel, color: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50" },
    { name: "Food & Dining", amount: food, icon: Utensils, color: "bg-orange-500", text: "text-orange-600", bg: "bg-orange-50" },
    { name: "Transport & Cabs", amount: transport, icon: Car, color: "bg-purple-500", text: "text-purple-600", bg: "bg-purple-50" },
    { name: "Activities & Passes", amount: activities, icon: Ticket, color: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Buffer & Misc", amount: misc, icon: Wallet, color: "bg-slate-500", text: "text-slate-600", bg: "bg-slate-50" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Estimated Budget
          </span>
          <h3 className="text-2xl font-black text-slate-900 flex items-center">
            <IndianRupee className="w-5 h-5 -mr-0.5 text-slate-800" />
            {total.toLocaleString()}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-400 block uppercase font-semibold">
            Average / Day
          </span>
          <span className="text-sm font-bold text-slate-700">
            ₹{perDay.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Visual Multi-Segment Bar */}
      {total > 0 && (
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
          {categories.map((cat) => {
            const pct = Math.max(0, (cat.amount / total) * 100);
            if (pct <= 0) return null;
            return (
              <div
                key={cat.name}
                className={`${cat.color} transition-all duration-300`}
                style={{ width: `${pct}%` }}
                title={`${cat.name}: ₹${cat.amount} (${pct.toFixed(0)}%)`}
              />
            );
          })}
        </div>
      )}

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const pct = total > 0 ? ((cat.amount / total) * 100).toFixed(0) : 0;
          return (
            <div
              key={cat.name}
              className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${cat.bg} ${cat.text} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {pct}% of total
                  </span>
                </div>
              </div>

              <span className="text-xs font-black text-slate-900">
                ₹{cat.amount.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
