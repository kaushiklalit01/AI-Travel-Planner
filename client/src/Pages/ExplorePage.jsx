import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Search, MapPin, Sparkles, Filter } from "lucide-react";

const EXPLORE_DATA = [
  {
    name: "Ladakh",
    state: "Jammu & Kashmir",
    category: "Mountains",
    desc: "Stunning high-altitude passes, blue lakes, and ancient Buddhist monasteries.",
    tag: "Adventure & High-Altitude",
    days: 7,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=640",
  },
  {
    name: "Goa",
    state: "West Coast",
    category: "Beaches",
    desc: "Sun-kissed beaches, Portuguese architecture, vibrant flea markets & nightlife.",
    tag: "Relaxed & Coastal",
    days: 4,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=640",
  },
  {
    name: "Manali",
    state: "Himachal Pradesh",
    category: "Mountains",
    desc: "Snow-capped peaks, Solang valley adventures, apple orchards & hippie cafes.",
    tag: "Treks & Snowy Passes",
    days: 5,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=640",
  },
  {
    name: "Kerala Backwaters",
    state: "Kerala",
    category: "Relaxed",
    desc: "Serene houseboat cruises through palm-fringed lagoons, spice hills & Ayurveda.",
    tag: "Nature & Slow Travel",
    days: 6,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=640",
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    category: "Heritage",
    desc: "The Pink City featuring Amber Fort, Hawa Mahal, bazaars, and royal dining.",
    tag: "Culture & Palaces",
    days: 4,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=640",
  },
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    category: "Treks",
    desc: "World capital of yoga, Ganga aarti, white-water river rafting and suspension bridges.",
    tag: "Spiritual & Outdoors",
    days: 3,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?q=80&w=640",
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    category: "Heritage",
    desc: "One of the oldest continuously inhabited cities on Earth with sacred ghats and silk looms.",
    tag: "Spiritual & Heritage",
    days: 3,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=640",
  },
  {
    name: "Udaipur",
    state: "Rajasthan",
    category: "Heritage",
    desc: "The City of Lakes, boat rides around Lake Pichola, and white marble palaces.",
    tag: "Romantic & Regal",
    days: 4,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=640",
  },
];

const CATEGORIES = ["All", "Mountains", "Beaches", "Heritage", "Treks", "Relaxed"];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = EXPLORE_DATA.filter((item) => {
    const matchCat = selectedCat === "All" || item.category === selectedCat;
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-3">
            <Compass className="w-3.5 h-3.5" />
            Curated Destinations
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore Places in India & Beyond
          </h1>
          <p className="mt-2 text-slate-500 text-sm sm:text-base">
            Find inspiration for your next journey, then launch the AI wizard to create a customized itinerary in seconds.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city, state, or vibe..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCat === cat
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((dest) => (
            <div
              key={dest.name}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
                  ★ {dest.rating}
                </span>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-white/95 text-slate-900 text-[10px] font-bold">
                  {dest.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {dest.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 block mb-2">
                    {dest.state}
                  </span>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {dest.days} Days Suggested
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(`/plan?dest=${encodeURIComponent(dest.name)}`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Plan Trip</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
