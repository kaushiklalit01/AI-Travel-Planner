import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Plus, Calendar, IndianRupee, Trash2, ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => {
    try {
      const trips = JSON.parse(localStorage.getItem("itinera_saved_trips") || "[]");
      setSavedTrips(trips);
    } catch (e) {
      console.warn("Could not read saved trips:", e);
    }
  }, []);

  const handleDelete = (tripId) => {
    if (window.confirm("Remove this trip from your dashboard?")) {
      const updated = savedTrips.filter((t) => t.id !== tripId);
      setSavedTrips(updated);
      localStorage.setItem("itinera_saved_trips", JSON.stringify(updated));
      toast.success("Trip removed.");
    }
  };

  const handleOpenTrip = (trip) => {
    navigate(`/trip/${trip.id}`, { state: { trip } });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Bookmark className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                My Trips & Saved Itineraries
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Manage your generated adventures, revisit daily schedules, and plan new trips.
            </p>
          </div>

          <Link
            to="/plan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Trip</span>
          </Link>
        </div>

        {/* Trips Grid or Empty State */}
        {savedTrips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No trips saved yet
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Ready to embark on an adventure? Run the 5-step trip wizard to generate and save your first plan.
            </p>
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your First Trip</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100/70 text-emerald-800">
                      Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(trip.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                    {trip.title || trip.destination}
                  </h3>
                  <span className="text-xs text-slate-400 block mb-4">
                    Destination: <strong className="text-slate-700">{trip.destination}</strong>
                  </span>

                  <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        Duration
                      </span>
                      <span className="font-semibold text-slate-800">
                        {trip.days} Days
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                        Estimated Budget
                      </span>
                      <span className="font-semibold text-slate-800">
                        ₹{trip.budget?.toLocaleString() || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Created {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenTrip(trip)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Open Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
