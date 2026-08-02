import { Hotel, UtensilsCrossed, Car, Wallet } from "lucide-react";

export default function BudgetCard({ budget }) {
  const total =
    budget.hotel +
    budget.food +
    budget.transport +
    budget.misc;

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl shadow-lg p-8">

      <h2 className="text-2xl font-bold text-green-700 mb-6">
        💰 Budget Breakdown
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white rounded-xl p-4 shadow">
          <Hotel className="text-blue-600 mb-2" />
          <p className="text-gray-500">Hotel</p>
          <h3 className="text-xl font-bold">
            ₹{budget.hotel}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <UtensilsCrossed className="text-orange-500 mb-2" />
          <p className="text-gray-500">Food</p>
          <h3 className="text-xl font-bold">
            ₹{budget.food}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <Car className="text-purple-600 mb-2" />
          <p className="text-gray-500">Transport</p>
          <h3 className="text-xl font-bold">
            ₹{budget.transport}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <Wallet className="text-green-600 mb-2" />
          <p className="text-gray-500">Misc</p>
          <h3 className="text-xl font-bold">
            ₹{budget.misc}
          </h3>
        </div>

      </div>

      <div className="mt-8 border-t pt-5 flex justify-between items-center">

        <span className="text-lg font-semibold">
          Estimated Total
        </span>

        <span className="text-3xl font-bold text-green-700">
          ₹{total}
        </span>

      </div>

    </div>
  );
}