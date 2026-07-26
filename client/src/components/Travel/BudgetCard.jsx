export default function BudgetCard({ budget }) {
  return (
    <div className="bg-blue-50 rounded-xl p-6 mt-6">

      <h2 className="text-xl font-bold mb-4">
        Budget Breakdown
      </h2>

      <div className="space-y-2">

        <p>🏨 Hotel : ₹{budget.hotel}</p>

        <p>🍽 Food : ₹{budget.food}</p>

        <p>🚕 Transport : ₹{budget.transport}</p>

        <p>🎉 Misc : ₹{budget.misc}</p>

      </div>

    </div>
  );
}