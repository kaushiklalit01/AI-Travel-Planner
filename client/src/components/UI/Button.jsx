export default function Button({
  children,
  loading,
}) {
  return (
    <button
      className="
        w-full
        py-3
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        text-white
        font-semibold
        transition
      "
    >
      {loading ? "Generating..." : children}
    </button>
  );
}