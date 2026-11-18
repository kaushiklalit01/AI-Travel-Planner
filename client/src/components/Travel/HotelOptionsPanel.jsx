import { Building2, Sparkles, IndianRupee, MapPin } from "lucide-react";

export default function HotelOptionsPanel({ hotels }) {
  if (!hotels || hotels.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-900">
            Recommended Stays & Hotels
          </h3>
          <p className="text-[11px] text-slate-400">
            Handpicked options tailored to your destination & budget
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {hotels.map((hotel, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-bold text-sm text-slate-900">
                {hotel.name}
              </h4>
              <span className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                <IndianRupee className="w-3 h-3" />
                {hotel.pricePerNight?.toLocaleString()}/night
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-600">
                {hotel.type}
              </span>
              <span className="flex items-center gap-0.5 text-slate-400 text-[11px]">
                <MapPin className="w-3 h-3 text-slate-400" />
                {hotel.area}
              </span>
            </div>

            {hotel.highlight && (
              <p className="text-xs text-slate-600 leading-snug">
                ✨ {hotel.highlight}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
