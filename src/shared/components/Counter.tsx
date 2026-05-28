"use client";

import { Minus, Plus } from "lucide-react";

interface CounterProps {
  label: string;
  description?: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

export function Counter({ 
  label, 
  description, 
  value, 
  onChange, 
  min = 0, 
  max = 100 
}: CounterProps) {
  
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col">
        <span className="text-text-main font-medium">{label}</span>
        {description && (
          <span className="text-text-muted text-sm">{description}</span>
        )}
      </div>
      
      <div className="flex items-center space-x-4 bg-background border border-surface-hover rounded-xl p-1">
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className="p-2 text-text-muted hover:text-primary disabled:opacity-50 disabled:hover:text-text-muted transition-colors cursor-pointer"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={18} />
        </button>
        
        <span className="tabular-numbers w-6 text-center font-semibold">
          {value}
        </span>
        
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className="p-2 text-text-muted hover:text-primary disabled:opacity-50 disabled:hover:text-text-muted transition-colors cursor-pointer"
          aria-label={`Increase ${label}`}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}