import { Check } from 'lucide-react';
import { WorkflowStep } from './data';

interface WorkflowStepperProps {
  currentStep: WorkflowStep;
}

const steps: { id: WorkflowStep; label: string; number: number }[] = [
  { id: 'choose', label: 'Choose Tool', number: 1 },
  { id: 'upload', label: 'Upload File', number: 2 },
  { id: 'configure', label: 'Configure Options', number: 3 },
  { id: 'process', label: 'Processing', number: 4 },
  { id: 'result', label: 'Download Result', number: 5 }
];

export function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-stone-200 -z-10 -translate-y-1/2" />
        <div 
          className="absolute left-0 top-1/2 h-0.5 bg-stone-900 -z-10 -translate-y-1/2 transition-all duration-500 ease-in-out" 
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center gap-3 bg-stone-50 px-2">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                  ${isCompleted ? 'bg-stone-900 text-white shadow-md' : ''}
                  ${isCurrent ? 'bg-white border-2 border-stone-900 text-stone-900 shadow-md scale-110' : ''}
                  ${isFuture ? 'bg-white border-2 border-stone-200 text-stone-400' : ''}
                `}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <span 
                className={`
                  text-xs font-semibold tracking-wide uppercase transition-colors duration-300
                  ${isCurrent ? 'text-stone-900' : 'text-stone-400'}
                  ${isCompleted ? 'text-stone-700' : ''}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
