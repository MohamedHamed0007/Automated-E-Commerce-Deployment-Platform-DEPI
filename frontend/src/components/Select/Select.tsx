export function Select({ label, error, options, className = '', ...props }: any) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <select
        className={`
          w-full px-4 py-2.5
          bg-gray-50 dark:bg-slate-700
          text-gray-900 dark:text-white
          border border-gray-200 dark:border-gray-600
          rounded-xl
          focus:outline-none
          focus:ring-2 focus:ring-blue-500/20
          focus:border-blue-500
          transition-all duration-200
          ${error ? 'border-red-500 dark:border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}