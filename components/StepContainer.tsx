'use client';

import React, { ReactNode } from 'react';

interface StepContainerProps {
    children: ReactNode;
    direction?: 'left' | 'right';
    active?: boolean;
}

export default function StepContainer({ children, active }: StepContainerProps) {
    if (!active) return null;

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {children}
        </div>
    );
}
