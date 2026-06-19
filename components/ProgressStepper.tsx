'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, FileSearch, AlertTriangle, Scale, Sparkles } from 'lucide-react';

interface AnalysisStep {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
}

interface ProgressStepperProps {
    currentStep?: number;
    isComplete?: boolean;
}

const steps: AnalysisStep[] = [
    {
        id: 'parse',
        label: 'Parsing Document',
        description: 'Extracting text and structure',
        icon: <FileSearch className="w-5 h-5" />,
    },
    {
        id: 'identify',
        label: 'Identifying Clauses',
        description: 'Locating key provisions',
        icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
        id: 'analyze',
        label: 'Risk Evaluation',
        description: 'Assessing potential concerns',
        icon: <Scale className="w-5 h-5" />,
    },
    {
        id: 'benchmark',
        label: 'Industry Comparison',
        description: 'Comparing to standards',
        icon: <Sparkles className="w-5 h-5" />,
    },
    {
        id: 'generate',
        label: 'Generating Report',
        description: 'Creating recommendations',
        icon: <CheckCircle className="w-5 h-5" />,
    },
];

export default function ProgressStepper({ currentStep = 0, isComplete = false }: ProgressStepperProps) {
    const [animatedStep, setAnimatedStep] = useState(0);
    const [pulseStep, setPulseStep] = useState(0);

    // Auto-advance animation for demo purposes
    useEffect(() => {
        if (isComplete) {
            setAnimatedStep(steps.length);
            return;
        }

        const interval = setInterval(() => {
            setAnimatedStep(prev => {
                if (prev >= steps.length) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [isComplete]);

    // Pulse animation for current step
    useEffect(() => {
        setPulseStep(animatedStep);
    }, [animatedStep]);

    const getStepStatus = (stepIndex: number) => {
        if (isComplete || stepIndex < animatedStep) return 'complete';
        if (stepIndex === animatedStep) return 'current';
        return 'pending';
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Progress bar background */}
            <div className="relative">
                {/* Connection line */}
                <div className="absolute top-6 left-8 right-8 h-0.5 bg-stone-200">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-700 ease-out"
                        style={{
                            width: `${Math.min(100, (animatedStep / (steps.length - 1)) * 100)}%`
                        }}
                    />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                        const status = getStepStatus(index);
                        const isCurrentPulse = index === pulseStep && status === 'current';

                        return (
                            <div key={step.id} className="flex flex-col items-center">
                                {/* Step circle */}
                                <div
                                    className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-500 ease-out
                    ${status === 'complete'
                                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white scale-100'
                                            : status === 'current'
                                                ? 'bg-white border-2 border-indigo-600 text-indigo-600'
                                                : 'bg-white border-2 border-stone-200 text-stone-400'
                                        }
                    ${isCurrentPulse ? 'animate-pulse' : ''}
                  `}
                                >
                                    {status === 'complete' ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : status === 'current' ? (
                                        <div className="relative">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            {/* Glow effect */}
                                            <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20" />
                                        </div>
                                    ) : (
                                        step.icon
                                    )}

                                    {/* Ring animation for current step */}
                                    {status === 'current' && (
                                        <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-40" />
                                    )}
                                </div>

                                {/* Step label */}
                                <div className="mt-3 text-center max-w-[120px]">
                                    <p className={`text-sm font-semibold transition-colors duration-300 ${status === 'complete'
                                            ? 'text-indigo-600'
                                            : status === 'current'
                                                ? 'text-stone-900'
                                                : 'text-stone-400'
                                        }`}>
                                        {step.label}
                                    </p>
                                    <p className={`text-xs mt-0.5 transition-colors duration-300 ${status === 'pending' ? 'text-stone-300' : 'text-stone-500'
                                        }`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Current step detail */}
            <div className="mt-8 text-center">
                {!isComplete && animatedStep < steps.length && (
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-200">
                        <div className="relative">
                            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                        </div>
                        <span className="text-indigo-900 font-medium">
                            {steps[animatedStep]?.label}...
                        </span>
                    </div>
                )}
                {isComplete && (
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-900 font-medium">Analysis Complete!</span>
                    </div>
                )}
            </div>
        </div>
    );
}
