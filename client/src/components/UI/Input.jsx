export default function Input({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          px-4
          py-3
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          transition
        "
      />
    </div>
  );
}