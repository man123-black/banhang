export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="mb-3">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
        {...props} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
