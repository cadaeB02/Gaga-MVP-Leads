'use client';

import React from 'react';

interface ProgressDotsProps {
    steps: number;
    currentStep: number;
    onStepClick?: (step: number) => void;
}

export default function ProgressDots({ steps, currentStep, onStepClick }: ProgressDotsProps) {
    return (
        <div className="flex items-center justify-center gap-3 mb-8">
            {Array.from({ length: steps }).map((_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                const isClickable = onStepClick && stepNumber < currentStep;

                return (
                    <button
                        key={index}
                        type="button"
                        disabled={!isClickable}
                        onClick={() => isClickable && onStepClick(stepNumber)}
                        className={`transition-all duration-300 rounded-full ${
                            isActive 
                                ? 'w-4 h-4 bg-cyan-600 ring-4 ring-cyan-100' 
                                : isCompleted 
                                    ? 'w-3 h-3 bg-cyan-400 hover:bg-cyan-500 cursor-pointer' 
                                    : 'w-3 h-3 bg-gray-200 cursor-default'
                        }`}
                        aria-current={isActive ? 'step' : undefined}
                        aria-label={`Go to step ${stepNumber}`}
                    />
                );
            })}
        </div>
    );
}
