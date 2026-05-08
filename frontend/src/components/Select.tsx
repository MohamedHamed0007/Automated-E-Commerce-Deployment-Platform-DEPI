import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  labelClass?: string;
  options: SelectOption[];
  className?: string;
}

export function Select({
  label,
  labelClass = 'block text-sm mb-2 text-gray-700',
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className={labelClass}>{label}</label>}

      <select
        className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
          transition-all duration-200 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
