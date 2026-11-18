import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

export default function WarningsPanel({ warnings }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="bg-amber-50/60 rounded-3xl border border-amber-200/90 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-amber-200/60">
        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-base text-amber-950">
            Travel Warnings & Smart Alternatives
          </h3>
          <p className="text-[11px] text-amber-700/80">
            AI-detected local bottlenecks, peak hours & crowd-avoidance tips
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {warnings.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-white border border-amber-100 shadow-xs space-y-2"
          >
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider shrink-0 bg-rose-50 px-2 py-0.5 rounded">
                Heads up
              </span>
              <p className="text-xs font-medium text-slate-800 leading-snug">
                {item.warning}
              </p>
            </div>

            <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider shrink-0 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Alternative
              </span>
              <p className="text-xs text-slate-600 leading-snug">
                {item.alternative}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
