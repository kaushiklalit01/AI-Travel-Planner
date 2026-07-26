export default function TravelTips({ tips }) {
  return (
    <div className="mt-8">

      <h2 className="text-xl font-bold mb-3">
        Travel Tips
      </h2>

      <ul className="list-disc pl-6 space-y-2">

        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}

      </ul>

    </div>
  );
}