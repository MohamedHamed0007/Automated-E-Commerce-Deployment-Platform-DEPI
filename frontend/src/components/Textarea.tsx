import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm mb-2 text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
          transition-all duration-200 resize-none ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
