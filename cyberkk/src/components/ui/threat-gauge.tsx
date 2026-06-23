import React from "react";
import { cn } from "@/lib/utils";

interface ThreatGaugeProps {
  score: number;
  status: "safe" | "suspicious" | "high_risk";
  className?: string;
}

export function ThreatGauge({ score, status, className }: ThreatGaugeProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  let color = "text-green-500";
  let bgGlow = "bg-green-500/20";
  
  if (status === "suspicious" || (score > 30 && score <= 70)) {
    color = "text-yellow-500";
    bgGlow = "bg-yellow-500/20";
  } else if (status === "high_risk" || score > 70) {
    color = "text-red-500";
    bgGlow = "bg-red-500/20";
  }

  // SVG parameters
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // It's a half circle, so dasharray is circumference / 2
  const arcLength = circumference / 2;
  const strokeDashoffset = arcLength - (normalizedScore / 100) * arcLength;

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <div className={cn("absolute inset-0 rounded-full blur-[40px] opacity-40 mix-blend-screen", bgGlow)} />
      
      <svg
        height={radius * 1.2}
        width={radius * 2}
        className="relative z-10 drop-shadow-md"
      >
        <path
          stroke="currentColor"
          className="text-muted-foreground/20"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${arcLength}`}
          style={{ strokeDashoffset: 0, transform: "rotate(-180deg)", transformOrigin: "50% 100%" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <path
          stroke="currentColor"
          className={cn("transition-all duration-1000 ease-out", color)}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${arcLength}`}
          style={{ strokeDashoffset, transform: "rotate(-180deg)", transformOrigin: "50% 100%" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute bottom-2 flex flex-col items-center">
        <span className={cn("text-3xl font-display font-bold tabular-nums", color)}>
          {Math.round(normalizedScore)}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Risk Score
        </span>
      </div>
    </div>
  );
}
