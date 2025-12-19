"use client"

import React from 'react';
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number;
  color?: string;
  className?: string;
}

export const ProgressRing = ({ 
    radius, 
    stroke, 
    progress, 
    color = "currentColor", 
    className 
}: ProgressRingProps) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg]"
      >
        <circle
          stroke={color}
          strokeOpacity={0.2}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s ease-in-out" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {Math.round(progress)}%
      </div>
    </div>
  );
};
