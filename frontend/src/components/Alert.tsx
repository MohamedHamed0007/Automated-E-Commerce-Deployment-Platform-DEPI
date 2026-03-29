import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Alert({ variant = 'info', title, children, onClose, className = '' }: AlertProps) {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: Info,
      iconColor: 'text-blue-600',
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-900',
      icon: CheckCircle2,
      iconColor: 'text-green-600',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-900',
      icon: AlertCircle,
      iconColor: 'text-red-600',
    },
  };
  
  const config = variants[variant];
  const Icon = config.icon;
  
  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${config.container} ${className}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
