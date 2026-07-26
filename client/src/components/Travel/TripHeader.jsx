export default function TripHeader({ itinerary }) {
  return (
    <div className="mb-8">

      <h1 className="text-3xl font-bold text-blue-600">
        {itinerary.tripTitle}
      </h1>

      <p className="mt-3 text-gray-600">
        {itinerary.summary}
      </p>

    </div>
  );
}