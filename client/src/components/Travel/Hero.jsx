import { Plane, Sparkles } from "lucide-react";
import heroImage from "../../assets/travel-hero.png";

export default function Hero({ children }) {
  return (
    <section
      className="relative w-full overflow-hidden min-h-[620px] bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Content */}
      <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg">
            <Plane className="text-blue-600" size={32} />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center text-white max-w-4xl mx-auto">

          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={20} />
            <span className="font-medium">
              AI-Powered Travel Planning
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            AI Travel Planner
          </h1>

          <p className="mt-4 text-base md:text-xl text-white/90 max-w-3xl mx-auto">
            Plan your perfect vacation with the power of AI.
            Get personalized itineraries, budgets and travel tips in seconds.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-10">
  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
    {children}
  </div>
</div>
      </div>
    </section>
  );
}
