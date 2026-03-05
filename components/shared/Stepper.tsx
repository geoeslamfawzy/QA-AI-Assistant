'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && index <= currentStep;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step */}
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={cn(
                'flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isCompleted && 'bg-green-dim border border-green-500/50 text-green-500',
                isCurrent && 'bg-accent-dim border border-primary text-primary',
                !isCompleted && !isCurrent && 'border border-border text-muted-foreground',
                isClickable && 'cursor-pointer hover:bg-muted'
              )}
            >
              {/* Step number or check */}
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                  isCompleted && 'bg-green-500 text-white',
                  isCurrent && 'bg-primary text-white',
                  !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  index + 1
                )}
              </span>
              <div className="text-left">
                <span className="block font-medium">{step.label}</span>
                {step.description && (
                  <span className="block text-xs text-muted-foreground">
                    {step.description}
                  </span>
                )}
              </div>
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-3 h-[2px] w-12',
                  index < currentStep ? 'bg-green-500' : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
