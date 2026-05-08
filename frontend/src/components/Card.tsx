import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div 
      className={`bg-white rounded-xl border dark:bg-slate-800 border-gray-200 shadow-sm 
        ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} 
        ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
