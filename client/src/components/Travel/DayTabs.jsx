import { Calendar, Layers } from "lucide-react";

export default function DayTabs({ days, activeTab, onSelectTab }) {
  return (
    <div className="w-full bg-white p-2 rounded-2xl border border-slate-200/90 shadow-sm mb-6">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {/* All Days Overview Tab */}
        <button
          type="button"
          onClick={() => onSelectTab("all")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 ${
            activeTab === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Days</span>
        </button>

        {/* Individual Day Tabs */}
        {days.map((day) => {
          const isActive = activeTab === day.day;
          return (
            <button
              key={day.day}
              type="button"
              onClick={() => onSelectTab(day.day)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Day {day.day}</span>
              {day.theme && (
                <span
                  className={`hidden md:inline-block text-[10px] font-normal px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {day.theme}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
