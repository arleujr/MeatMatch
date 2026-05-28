"use client";

import { Check } from "lucide-react";
import clsx from "clsx";

interface ItemCardProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function ItemCard({ label, isSelected, onClick }: ItemCardProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer w-full",
        isSelected 
          ? "bg-primary/10 border-primary text-text-main shadow-sm" 
          : "bg-surface border-surface-hover text-text-muted hover:border-text-muted/50"
      )}
    >
      <span className="font-medium">{label}</span>
      
      <div className={clsx(
        "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
        isSelected ? "bg-primary text-background" : "bg-transparent border border-surface-hover"
      )}>
        {isSelected && <Check size={14} strokeWidth={3} />}
      </div>
    </button>
  );
}