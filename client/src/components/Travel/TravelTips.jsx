import { Lightbulb, CheckCircle2 } from "lucide-react";

export default function TravelTips({ tips }) {
  return (
    <div className="bg-yellow-50 rounded-3xl shadow-lg p-8">

      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="text-yellow-500" size={28} />
        <h2 className="text-2xl font-bold text-yellow-700">
          Travel Tips
        </h2>
      </div>

      <div className="space-y-4">

        {tips.map((tip, index) => (

          <div
            key={index}
            className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm"
          >

            <CheckCircle2
              className="text-green-500 mt-1"
              size={20}
            />

            <p className="text-gray-700">
              {tip}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}