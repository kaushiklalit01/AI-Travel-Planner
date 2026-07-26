export default function DayCard({ day }) {
  return (
    <div className="border rounded-xl p-6 mb-5">

      <h2 className="text-xl font-bold mb-2">
        Day {day.day}
      </h2>

      <h3 className="font-semibold text-blue-600 mb-4">
        {day.title}
      </h3>

      <div className="space-y-3">

        {day.activities.map((activity, index) => (

          <div
            key={index}
            className="flex gap-4"
          >

            <div className="font-semibold w-28">
              {activity.time}
            </div>

            <div>
              {activity.activity}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}