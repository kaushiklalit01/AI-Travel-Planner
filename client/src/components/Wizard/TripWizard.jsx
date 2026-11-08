import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import StepProgress from "./StepProgress";
import Step1Destination from "./Step1Destination";
import Step2Dates from "./Step2Dates";
import Step3TravelParty from "./Step3TravelParty";
import Step4TravelStyle from "./Step4TravelStyle";
import Step5BudgetAndPace from "./Step5BudgetAndPace";

import api from "../../services/api";

const STORAGE_KEY = "itinera_trip_wizard_draft";

const STEPS = [
  { number: 1, title: "Destination", subtitle: "Where to?" },
  { number: 2, title: "Dates", subtitle: "Duration & Season" },
  { number: 3, title: "Party", subtitle: "Who's going?" },
  { number: 4, title: "Style", subtitle: "Vibe & Style" },
  { number: 5, title: "Budget & Pace", subtitle: "Spend & Interests" },
];

const INITIAL_STATE = {
  destination: "",
  days: 4,
  startDate: "",
  endDate: "",
  season: "winter",
  partyType: "Friends",
  travelerCount: 2,
  selectedStyles: ["Adventure & Hiking", "Foodie & Culinary"],
  budgetTier: "Moderate",
  budgetAmount: 30000,
  pace: "Balanced",
  interests: ["Sunset Viewpoints", "Local Street Food"],
  specialRequests: "",
};

export default function TripWizard({ onPlanGenerated, initialDestination = "" }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [wizardData, setWizardData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (initialDestination) {
          parsed.destination = initialDestination;
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Could not load wizard draft:", e);
    }
    return {
      ...INITIAL_STATE,
      destination: initialDestination || INITIAL_STATE.destination,
    };
  });

  // Auto-save draft on data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wizardData));
    } catch (e) {
      console.warn("Could not save wizard draft:", e);
    }
  }, [wizardData]);

  // If initialDestination passed via prop (e.g. from Explore card), set it
  useEffect(() => {
    if (initialDestination) {
      setWizardData((prev) => ({ ...prev, destination: initialDestination }));
    }
  }, [initialDestination]);

  const updateField = (field, value) => {
    setWizardData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!wizardData.destination.trim()) {
        toast.error("Please enter a destination to continue!");
        return false;
      }
    }
    if (step === 2) {
      if (!wizardData.days || wizardData.days < 1) {
        toast.error("Trip duration must be at least 1 day!");
        return false;
      }
    }
    if (step === 3) {
      if (!wizardData.partyType) {
        toast.error("Please select who is travelling!");
        return false;
      }
    }
    if (step === 4) {
      if (wizardData.selectedStyles.length === 0) {
        toast.error("Please pick at least one travel style!");
        return false;
      }
    }
    if (step === 5) {
      if (!wizardData.budgetAmount || wizardData.budgetAmount <= 0) {
        toast.error("Please enter an estimated budget!");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset this trip draft?")) {
      setWizardData(INITIAL_STATE);
      setCurrentStep(1);
      localStorage.removeItem(STORAGE_KEY);
      toast.success("Draft reset.");
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setLoading(true);
    const toastId = toast.loading("Crafting your AI travel itinerary...");

    try {
      // Build normalized combined interests for current backend prompt compatibility
      const combinedInterests = [
        ...wizardData.interests,
        `Vibe: ${wizardData.selectedStyles.join(", ")}`,
        `Party: ${wizardData.partyType} (${wizardData.travelerCount} travelers)`,
        `Pace: ${wizardData.pace}`,
        wizardData.specialRequests ? `Notes: ${wizardData.specialRequests}` : null,
      ].filter(Boolean);

      const payload = {
        destination: wizardData.destination,
        days: Number(wizardData.days),
        budget: Number(wizardData.budgetAmount),
        interests: combinedInterests,
        // Full structured preferences payload for next phases
        preferences: {
          ...wizardData,
        },
      };

      const res = await api.post("/travel/plan", payload);

      toast.success("Itinerary generated successfully!", { id: toastId });

      if (onPlanGenerated) {
        onPlanGenerated(res.data, payload);
      }
    } catch (err) {
      console.error("Trip generation error:", err);
      toast.error(
        err.response?.data?.message || "Failed to generate itinerary. Please try again.",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-10 max-w-4xl mx-auto">
      {/* Wizard Header with Reset */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          AI Trip Planner Wizard
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Draft</span>
        </button>
      </div>

      {/* 5-Step Progress Bar */}
      <StepProgress
        currentStep={currentStep}
        steps={STEPS}
        onStepClick={(step) => {
          if (step < currentStep) setCurrentStep(step);
        }}
      />

      {/* Step Content */}
      <div className="py-4 min-h-[360px]">
        {currentStep === 1 && (
          <Step1Destination
            value={wizardData.destination}
            onChange={(val) => updateField("destination", val)}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2Dates
            days={wizardData.days}
            startDate={wizardData.startDate}
            endDate={wizardData.endDate}
            season={wizardData.season}
            onChangeDays={(val) => updateField("days", val)}
            onChangeStartDate={(val) => updateField("startDate", val)}
            onChangeEndDate={(val) => updateField("endDate", val)}
            onChangeSeason={(val) => updateField("season", val)}
          />
        )}

        {currentStep === 3 && (
          <Step3TravelParty
            partyType={wizardData.partyType}
            travelerCount={wizardData.travelerCount}
            onChangePartyType={(val) => updateField("partyType", val)}
            onChangeCount={(val) => updateField("travelerCount", val)}
          />
        )}

        {currentStep === 4 && (
          <Step4TravelStyle
            selectedStyles={wizardData.selectedStyles}
            onToggleStyle={(styleLabel) => {
              const current = wizardData.selectedStyles;
              const next = current.includes(styleLabel)
                ? current.filter((s) => s !== styleLabel)
                : [...current, styleLabel];
              updateField("selectedStyles", next);
            }}
          />
        )}

        {currentStep === 5 && (
          <Step5BudgetAndPace
            budgetTier={wizardData.budgetTier}
            budgetAmount={wizardData.budgetAmount}
            pace={wizardData.pace}
            interests={wizardData.interests}
            specialRequests={wizardData.specialRequests}
            onChangeBudgetTier={(val) => updateField("budgetTier", val)}
            onChangeBudgetAmount={(val) => updateField("budgetAmount", val)}
            onChangePace={(val) => updateField("pace", val)}
            onAddInterest={(tag) =>
              updateField("interests", [...wizardData.interests, tag])
            }
            onRemoveInterest={(tag) =>
              updateField(
                "interests",
                wizardData.interests.filter((t) => t !== tag)
              )
            }
            onChangeSpecialRequests={(val) =>
              updateField("specialRequests", val)
            }
          />
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Itinerary...</span>
            </>
          ) : currentStep === 5 ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Travel Plan</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
