import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
} from "lucide-react";

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">

      <div className="flex items-center justify-between mb-5">

        <div>
          <p className="text-sm opacity-80">
            Current Weather
          </p>

          <h2 className="text-2xl font-bold">
            {weather.city}, {weather.country}
          </h2>
        </div>

        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-16 h-16"
        />

      </div>

      <div className="flex items-center gap-3 mb-5">

        <Thermometer size={28} />

        <div>
          <p className="text-4xl font-bold">
            {weather.temperature}°C
          </p>

          <p className="capitalize opacity-90">
            {weather.description}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Thermometer size={18} />
            <span className="text-sm">Feels Like</span>
          </div>

          <p className="font-bold mt-1">
            {weather.feelsLike}°C
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Droplets size={18} />
            <span className="text-sm">Humidity</span>
          </div>

          <p className="font-bold mt-1">
            {weather.humidity}%
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Wind size={18} />
            <span className="text-sm">Wind</span>
          </div>

          <p className="font-bold mt-1">
            {weather.windSpeed} m/s
          </p>
        </div>

      </div>

    </div>
  );
}