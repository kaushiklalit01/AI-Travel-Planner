import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Plus,
  Calendar,
  IndianRupee,
  Trash2,
  Copy,
  Edit3,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renamingTripId, setRenamingTripId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const loadTrips = async () => {
    setLoading(true);
    try {
      // 1. Try fetching from backend Prisma API
      const res = await api.get("/trips");
      if (res.data?.success && res.data.trips) {
        setTrips(res.data.trips);
        return;
      }
    } catch (err) {
      console.warn("Backend /trips unavailable, reading local storage fallback:", err);
    }

    // 2. Fallback to localStorage
    try {
      const localTrips = JSON.parse(localStorage.getItem("itinera_saved_trips") || "[]");
      setTrips(localTrips);
    } catch (e) {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [isAuthenticated]);

  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip itinerary?")) return;

    try {
      await api.delete(`/trips/${tripId}`);
      toast.success("Trip deleted from database.");
    } catch (err) {
      console.warn("API delete failed or running offline, removing locally:", err);
    }

    // Update state and localStorage
    const updated = trips.filter((t) => t.id !== tripId);
    setTrips(updated);
    try {
      localStorage.setItem("itinera_saved_trips", JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDuplicate = async (tripId) => {
    const toastId = toast.loading("Duplicating trip...");
    try {
      const res = await api.post(`/trips/${tripId}/duplicate`);
      if (res.data?.success) {
        toast.success("Trip duplicated successfully!", { id: toastId });
        loadTrips();
        return;
      }
    } catch (err) {
      console.warn("Backend duplicate failed, cloning locally:", err);
    }

    // Local clone fallback
    const tripToClone = trips.find((t) => t.id === tripId);
    if (tripToClone) {
      const cloned = {
        ...tripToClone,
        id: "trip_" + Date.now(),
        title: `${tripToClone.title || tripToClone.destination} (Copy)`,
        createdAt: new Date().toISOString(),
      };
      const updated = [cloned, ...trips];
      setTrips(updated);
      localStorage.setItem("itinera_saved_trips", JSON.stringify(updated));
      toast.success("Trip duplicated locally!", { id: toastId });
    }
  };

  const handleStartRename = (trip) => {
    setRenamingTripId(trip.id);
    setNewTitle(trip.title || trip.destination);
  };

  const handleSaveRename = async (tripId) => {
    if (!newTitle.trim()) return;

    try {
      await api.put(`/trips/${tripId}`, { title: newTitle.trim() });
      toast.success("Trip renamed.");
    } catch (err) {
      console.warn("API rename failed, updating locally:", err);
    }

    const updated = trips.map((t) =>
      t.id === tripId ? { ...t, title: newTitle.trim() } : t
    );
    setTrips(updated);
    try {
      localStorage.setItem("itinera_saved_trips", JSON.stringify(updated));
    } catch (e) {}
    setRenamingTripId(null);
  };

  const handleOpenTrip = (trip) => {
    navigate(`/trip/${trip.id}`, { state: { trip } });
  };

  const getStatusBadge = (status) => {
    const s = (status || "READY").toUpperCase();
    if (s === "READY") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Ready
        </span>
      );
    }
    if (s === "GENERATING") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" />
          Generating
        </span>
      );
    }
    if (s === "FAILED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
          <AlertCircle className="w-3 h-3" />
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
        <Clock className="w-3 h-3" />
        Draft
      </span>
    );
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
                My Trips & Saved Plans
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {isAuthenticated
                ? `Logged in as ${user?.name || user?.email}. Trips are synced to your database account.`
                : "Saved plans in your browser. Sign in to synchronize trips across devices."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={loadTrips}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm"
              title="Refresh Trips"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            {!isAuthenticated && (
              <button
                type="button"
                onClick={openAuthModal}
                className="px-4 py-2.5 rounded-full text-xs font-bold border border-emerald-600 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/60 transition-colors"
              >
                Sync with Account
              </button>
            )}

            <Link
              to="/plan"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Plan New Trip</span>
            </Link>
          </div>
        </div>

        {/* Trips Grid or Empty State */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading saved itineraries from database...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No saved trips yet
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Ready to embark on an adventure? Run the 5-step trip wizard to generate and save your first plan.
            </p>
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your First Trip</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Status & Actions Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getStatusBadge(trip.status)}

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartRename(trip)}
                        className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Rename Trip"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicate(trip.id)}
                        className="text-slate-400 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Duplicate Trip"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(trip.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title (or Inline Rename Input) */}
                  {renamingTripId === trip.id ? (
                    <div className="mb-3 flex gap-2">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveRename(trip.id)}
                        className="flex-1 px-2.5 py-1 text-sm font-bold border border-emerald-500 rounded-lg outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRename(trip.id)}
                        className="px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-lg font-black text-slate-900 mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {trip.title || trip.destination}
                    </h3>
                  )}

                  <span className="text-xs text-slate-400 block mb-4">
                    Destination: <strong className="text-slate-700">{trip.destination}</strong>
                  </span>

                  {/* Trip Stats */}
                  <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        Duration
                      </span>
                      <span className="font-semibold text-slate-800">
                        {trip.preferences?.totalDays || trip.days || 4} Days
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                        Estimated Budget
                      </span>
                      <span className="font-semibold text-slate-800">
                        ₹{(trip.totalBudget || trip.budget || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="mt-5 pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Created {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenTrip(trip)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 active:scale-95 transition-all"
                  >
                    <span>Revisit Plan</span>
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
