import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, FileDown, Loader2, Sparkles, Printer } from "lucide-react";
import toast from "react-hot-toast";

import TripHeader from "../components/Travel/TripHeader";
import ItineraryWorkspace from "../components/Travel/ItineraryWorkspace";
import ShareCollaboratorModal from "../components/Travel/ShareCollaboratorModal";
import api from "../services/api";

export default function TripWorkspacePage() {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(location.state?.trip || null);
  const [loading, setLoading] = useState(!location.state?.trip);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (trip && trip.itinerary) {
        setLoading(false);
        return;
      }

      if (!tripId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // 1. Try fetching from backend Prisma API
      try {
        const res = await api.get(`/trips/${tripId}`);
        if (res.data?.success && res.data.itinerary) {
          setTrip({
            ...res.data.trip,
            itinerary: res.data.itinerary,
            destinationImages: res.data.destinationImages || [],
            weather: res.data.weather || null,
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Backend trip fetch error, checking local storage:", err);
      }

      // 2. Fallback to localStorage
      try {
        const saved = JSON.parse(localStorage.getItem("itinera_saved_trips") || "[]");
        const found = saved.find((t) => t.id === tripId);
        if (found) {
          const formatted = found.data
            ? {
                ...found,
                itinerary: found.data.itinerary,
                destinationImages: found.data.destinationImages || [],
                weather: found.data.weather || null,
              }
            : found;
          setTrip(formatted);
        }
      } catch (e) {
        console.warn("Could not find local trip:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const handleDownloadPdf = async () => {
    if (!tripId || tripId.length < 10) {
      // Local fallback print if not in DB
      window.print();
      return;
    }

    setPdfDownloading(true);
    const toastId = toast.loading("Generating your custom travel PDF...");

    try {
      const res = await api.get(`/trips/${tripId}/export/pdf`, {
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `itinera-${(trip.destination || "trip").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (err) {
      console.warn("Server PDF export failed, using browser print fallback:", err);
      toast.dismiss(toastId);
      window.print();
    } finally {
      setPdfDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-24 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-3" />
        <p className="text-sm text-slate-500 font-semibold">Loading your itinerary workspace...</p>
      </div>
    );
  }

  const itinerary = trip?.itinerary || trip?.data?.itinerary;
  const destinationImages = trip?.destinationImages || trip?.data?.destinationImages || [];
  const weather = trip?.weather || trip?.data?.weather || null;

  if (!trip || !itinerary) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Trip Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            We couldn't locate this trip in the database or your local storage.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/plan"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Plan New Trip
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
        {/* Workspace Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Saved Trips</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Share & Invite</span>
            </button>

            <button
              type="button"
              disabled={pdfDownloading}
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs active:scale-95 transition-all disabled:opacity-50"
            >
              {pdfDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Trip Title & Header Banner */}
        {itinerary && <TripHeader itinerary={itinerary} />}

        {/* Itinerary Tabbed Workspace */}
        {itinerary && (
          <ItineraryWorkspace
            tripId={tripId || trip.id}
            itinerary={itinerary}
            destinationImages={destinationImages}
            weather={weather}
            onItineraryUpdated={(updatedItinerary) => {
              setTrip((prev) => ({
                ...prev,
                title: updatedItinerary.tripTitle || prev.title,
                summary: updatedItinerary.summary || prev.summary,
                itinerary: updatedItinerary,
              }));
            }}
          />
        )}

        {/* Collaborators Modal */}
        <ShareCollaboratorModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          tripId={tripId || trip.id}
          tripTitle={trip.title}
        />
      </div>
    </div>
  );
}
