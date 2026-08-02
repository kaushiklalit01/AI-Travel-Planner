import TripHeader from "./TripHeader";
import DayCard from "./DayCard";
import BudgetCard from "./BudgetCard";
import TravelTips from "./TravelTips";

export default function Itinerary({ itinerary }) {
  return (
    <div className="space-y-6">

      <TripHeader itinerary={itinerary} />

      {itinerary.days.map((day) => (
        <DayCard
          key={day.day}
          day={day}
        />
      ))}

      <BudgetCard
        budget={itinerary.budget}
      />

      <TravelTips
        tips={itinerary.travelTips}
      />

    </div>
  );
}