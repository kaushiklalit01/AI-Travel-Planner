import { useState } from "react";
import { Sparkles, Send, X, Loader2, ArrowRight, Wand2, Lightbulb, Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const QUICK_PROMPTS = [
  { label: "Make Day 2 cheaper", icon: "💰", prompt: "Make Day 2 activities and dining more budget-friendly." },
  { label: "Add more food experiences", icon: "🍜", prompt: "Add more authentic street food walks, famous regional snacks, and local dining spots." },
  { label: "Reduce walking distance", icon: "🚶", prompt: "Group activities closer together and reduce required walking distance." },
  { label: "Make schedule more relaxed", icon: "🏖️", prompt: "Make the daily pace more relaxed with longer downtime at cafes and scenic spots." },
  { label: "Add iconic photography spots", icon: "📸", prompt: "Include the best viewpoints and golden-hour photography spots for great pictures." },
  { label: "Replace Day 1 afternoon stop", icon: "⚡", prompt: "Replace the afternoon activity on Day 1 with an exciting alternative attraction." },
];

export default function TripChatDrawer({ tripId, currentItinerary, onItineraryRefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRefine = async (customText) => {
    const textToSubmit = customText || instruction;
    if (!textToSubmit.trim()) {
      toast.error("Please enter a refinement instruction!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("AI is refining your travel plan...");

    try {
      const res = await api.post(`/trips/${tripId || "temp"}/refine`, {
        instruction: textToSubmit.trim(),
        currentItinerary,
      });

      if (res.data?.success && res.data.itinerary) {
        toast.success("Itinerary updated successfully!", { id: toastId });
        if (onItineraryRefined) {
          onItineraryRefined(res.data.itinerary);
        }
        setInstruction("");
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Refine Error:", err);
      toast.error(
        err.response?.data?.message || "Failed to refine plan. Please try again.",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Refine Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 border-2 border-white/40 transition-all group"
      >
        <Wand2 className="w-4 h-4 animate-bounce" />
        <span>Refine Plan with AI</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-50/80 to-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Refine Itinerary with AI
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ask AI to tweak activities, pace, budgets, or dining
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Quick Refinement Ideas
                </span>
                <div className="space-y-2">
                  {QUICK_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={loading}
                      onClick={() => handleRefine(item.prompt)}
                      className="w-full text-left p-3 rounded-2xl border border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/60 active:scale-[0.98] transition-all flex items-center justify-between group text-xs text-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{item.icon}</span>
                        <strong className="group-hover:text-emerald-800 transition-colors">
                          {item.label}
                        </strong>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {loading && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-900">
                    AI is analyzing your request & adjusting schedule...
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Recalculating times, coordinates & cost estimates
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Custom Prompt Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Custom Instruction
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  disabled={loading}
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRefine()}
                  placeholder="e.g. Add an evening cafe by the lake..."
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-slate-800"
                />
                <button
                  type="button"
                  disabled={loading || !instruction.trim()}
                  onClick={() => handleRefine()}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white disabled:opacity-40 transition-all"
                  title="Send Instruction"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
