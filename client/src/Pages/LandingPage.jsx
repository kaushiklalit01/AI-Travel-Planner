import { Link, useNavigate } from "react-router-dom";
import { Sparkles, MapPin, Calendar, Users, ArrowRight, ShieldCheck, CloudSun, Compass, IndianRupee } from "lucide-react";

const FEATURED_DESTINATIONS = [
  {
    name: "Ladakh",
    region: "Jammu & Kashmir",
    tag: "High-Altitude & Treks",
    days: "7 Days",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=640",
  },
  {
    name: "Goa",
    region: "Coastal India",
    tag: "Beaches & Nightlife",
    days: "4 Days",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=640",
  },
  {
    name: "Manali",
    region: "Himachal Pradesh",
    tag: "Snow Valleys & Cafes",
    days: "5 Days",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=640",
  },
  {
    name: "Kerala",
    region: "South India",
    tag: "Backwaters & Ayurveda",
    days: "6 Days",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=640",
  },
  {
    name: "Jaipur",
    region: "Rajasthan",
    tag: "Palaces & Heritage",
    days: "4 Days",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=640",
  },
  {
    name: "Rishikesh",
    region: "Uttarakhand",
    tag: "Yoga & River Rafting",
    days: "3 Days",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?q=80&w=640",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick Your Destination",
    desc: "Tell us where you want to go, or choose from trending adventure destinations.",
    icon: MapPin,
  },
  {
    step: "02",
    title: "Define Your Vibe",
    desc: "Specify dates, traveling companions, adventure preferences, and pace.",
    icon: Users,
  },
  {
    step: "03",
    title: "Set Your Budget",
    desc: "Choose between budget, moderate, or luxury tiers to match your wallet.",
    icon: IndianRupee,
  },
  {
    step: "04",
    title: "AI Crafts the Plan",
    desc: "Get a complete day-by-day plan with times, weather forecasts, and local tips.",
    icon: Sparkles,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen AI Travel Assistant</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Plan Your{" "}
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-900 bg-clip-text text-transparent italic">
              Dream Trip
            </span>{" "}
            with AI
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tell Itinera where you want to go. Get a full day-by-day itinerary with weather forecasts, local food spots, and practical tips — in under 60 seconds.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/plan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-base shadow-xl shadow-emerald-700/25 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Planning (Free)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base transition-all shadow-sm"
            >
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Explore Destinations</span>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-3 text-xs sm:text-sm text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              ⚡ Powered by Groq LLMs
            </span>
            <span>•</span>
            <span>🌤️ Real-Time Weather</span>
            <span>•</span>
            <span>📍 Paced Day-by-Day Guides</span>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                Top Destinations
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Popular places to explore in India
              </h2>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <span>View all destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                onClick={() => navigate(`/plan?dest=${encodeURIComponent(dest.name)}`)}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold">
                    ★ {dest.rating}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-semibold">
                    {dest.tag}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-500">{dest.region}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Suggested: {dest.days}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Plan Trip →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">
              The Planner Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Idea to Itinerary in 4 Steps
            </h2>
            <p className="mt-3 text-slate-500 text-sm sm:text-base">
              No spreadsheets, no confusing browser tabs. Just an intelligent wizard that plans around you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-200 transition-colors relative"
                >
                  <span className="text-3xl font-black text-slate-200 block mb-4">
                    {step.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Ready to build your next travel plan?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Join thousands of travelers who use AI to uncover local gems, optimal driving routes, and personalized travel schedules.
          </p>
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm sm:text-base active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-5 h-5" />
            <span>Launch the Trip Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
