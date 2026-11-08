import { Check } from "lucide-react";

export default function StepProgress({ currentStep, steps, onStepClick }) {
  return (
    <div className="w-full mb-8">
      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-slate-200 rounded-full z-0" />
        
        {/* Filled active track */}
        <div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-emerald-600 rounded-full transition-all duration-300 z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Step circles */}
        <div className="relative z-10 flex justify-between items-center">
          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isClickable = step.number < currentStep;

            return (
              <div key={step.number} className="flex flex-col items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick && onStepClick(step.number)}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 ${
                    isCompleted
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 cursor-pointer hover:bg-emerald-700"
                      : isCurrent
                      ? "bg-white text-emerald-700 border-2 border-emerald-600 shadow-lg shadow-emerald-600/20 ring-4 ring-emerald-100"
                      : "bg-white text-slate-400 border-2 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </button>

                <div className="mt-2 text-center hidden sm:block">
                  <span
                    className={`text-xs font-semibold block transition-colors ${
                      isCurrent
                        ? "text-emerald-800"
                        : isCompleted
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden md:block">
                    {step.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Title below progress */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-xs font-bold text-emerald-700">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
        </span>
      </div>
    </div>
  );
}
