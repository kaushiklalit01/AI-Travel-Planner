import { Cloud, Droplets, Wind, Thermometer, Sun, ShieldAlert, Sparkles } from "lucide-react";

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  const temp = Math.round(weather.temperature || 24);
  const feelsLike = Math.round(weather.feelsLike || temp);

  const getAdvisory = (t) => {
    if (t <= 5) return { text: "Heavy woollens, thermal innerwear & windproof jacket required.", tag: "Cold Advisory" };
    if (t <= 15) return { text: "Chilly evenings. Carry light jackets, hoodies or shawls.", tag: "Moderate Chill" };
    if (t <= 28) return { text: "Pleasant climate! Ideal for outdoor walking and sightseeing.", tag: "Ideal Weather" };
    return { text: "Warm & sunny. Carry sun protection, hats and stay hydrated.", tag: "Sun Advisory" };
  };

  const advisory = getAdvisory(temp);

  return (
    <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200 block">
            Real-Time Weather
          </span>
          <h3 className="text-xl font-black text-white tracking-tight">
            {weather.city || "Destination"}{weather.country ? `, ${weather.country}` : ""}
          </h3>
        </div>

        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description || "weather"}
            className="w-14 h-14 -my-2 drop-shadow-md"
          />
        )}
      </div>

      {/* Main Temperature Display */}
      <div className="flex items-baseline gap-3 mb-5">
        <span className="text-5xl font-black tracking-tight">{temp}°C</span>
        <div className="text-xs text-sky-100">
          <p className="capitalize font-semibold text-sm text-white">
            {weather.description || "Clear Sky"}
          </p>
          <p className="text-[11px] text-sky-200">
            Feels like {feelsLike}°C
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-300 shrink-0" />
          <div>
            <span className="text-[10px] text-sky-200 block">Humidity</span>
            <span className="font-bold text-white">{weather.humidity || 60}%</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2">
          <Wind className="w-4 h-4 text-sky-300 shrink-0" />
          <div>
            <span className="text-[10px] text-sky-200 block">Wind Speed</span>
            <span className="font-bold text-white">{weather.windSpeed || 12} km/h</span>
          </div>
        </div>
      </div>

      {/* Packing Advisory */}
      <div className="mt-4 pt-3 border-t border-white/15 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200 block mb-0.5">
          🎒 {advisory.tag}
        </span>
        <p className="text-[11px] text-sky-100 leading-snug">
          {advisory.text}
        </p>
      </div>
    </div>
  );
}
