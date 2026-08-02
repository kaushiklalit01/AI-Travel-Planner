import { Clock3, MapPin } from "lucide-react";

export default function DayCard({ day }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">

      <div className="mb-5">
        <h2 className="text-2xl font-bold text-blue-600">
          📅 Day {day.day}
        </h2>

        <p className="text-gray-500 mt-1">
          {day.title}
        </p>
      </div>

      <div className="space-y-4">

        {day.activities.map((activity, index) => (

          <div
            key={index}
            className="flex gap-4 border-l-4 border-blue-500 pl-4"
          >

            <div className="min-w-[90px]">

              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <Clock3 size={16} />
                {activity.time}
              </div>

            </div>

            <div className="flex items-start gap-2">

              <MapPin
                size={18}
                className="text-red-500 mt-1"
              />

              <span className="text-gray-700">
                {activity.activity}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}