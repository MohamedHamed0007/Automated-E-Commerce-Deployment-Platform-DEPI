import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                ${index < currentStep 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                  : index === currentStep 
                  ? 'bg-blue-500 text-white ring-4 ring-blue-100' 
                  : 'bg-gray-200 text-gray-500'}
              `}>
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-4 mb-8 transition-all duration-200 ${
                index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}