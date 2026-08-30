export default function Button({ children, loading }) {
  return (
    <button
      type="submit"
      className="
        group
        relative
        w-full
        flex
        items-center
        justify-center
        gap-3
        py-4
        px-6
        rounded-full
        bg-gradient-to-r
        from-indigo-100
        via-white
        to-cyan-100
        text-slate-600
        font-semibold
        text-lg
        border
        border-white/80
        shadow-lg
        hover:shadow-xl
        hover:scale-[1.01]
        transition-all
        duration-300
        overflow-hidden
      "
    >
      <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

      <span className="relative flex items-center gap-3">
        <span className="text-xl">✨</span>

        {loading ? "Generating..." : children}

        {!loading && (
          <span className="
            ml-2
            flex
            items-center
            justify-center
            w-9
            h-9
            rounded-full
            bg-white/90
            shadow-sm
            text-blue-600
            group-hover:translate-x-1
            transition-transform
          ">
            →
          </span>
        )}
      </span>
    </button>
  );
}