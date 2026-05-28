"use client";

import { useCalculatorStore } from "@/features/calculator/store/useCalculatorStore";
import { DollarSign, Users } from "lucide-react";

export function CostSplitter() {
  const store = useCalculatorStore();
  
  const hasResults = Object.keys(store.results).length > 0;
  if (!hasResults) return null;

  // Calculate total cost
  let totalCost = 0;
  Object.entries(store.results).forEach(([item, quantityInGramsOrMl]) => {
    const unitPrice = store.unitPrices[item] || 0;
    // Our math engine outputs in grams/ml, so we divide by 1000 to multiply by the price per kg/L
    const quantityInStandardUnit = quantityInGramsOrMl / 1000;
    totalCost += quantityInStandardUnit * unitPrice;
  });

  // Basic Split Logic: Total divided by number of adults
  const totalAdults = store.guestCount.adult_male + store.guestCount.adult_female;
  const costPerAdult = totalAdults > 0 ? totalCost / totalAdults : 0;

  return (
    <section className="bg-surface border border-surface-hover rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-jakarta text-xl font-semibold">Cost Breakdown</h2>
        <DollarSign className="text-primary" size={24} />
      </div>

      {/* Editable Price List */}
      <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {Object.entries(store.results).map(([item]) => {
          const formattedKey = item.replace('_', ' ').toUpperCase();
          const isDrink = item === "beer" || item === "soda";
          const unitLabel = isDrink ? "per L" : "per kg";

          return (
            <div key={item} className="flex justify-between items-center bg-background p-2 rounded-lg border border-surface-hover">
              <span className="text-sm font-medium text-text-muted">{formattedKey}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">{unitLabel}</span>
                <div className="relative w-24">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={store.unitPrices[item] || 0}
                    onChange={(e) => store.updateUnitPrice(item, parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface border border-surface-hover rounded-md pl-6 pr-2 py-1 text-sm font-inter tabular-numbers text-right focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grand Total & Split Results */}
      <div className="bg-background rounded-xl p-4 border border-surface-hover space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-text-muted font-medium">Grand Total</span>
          <span className="text-3xl font-jakarta font-bold tabular-numbers text-primary">
            ${totalCost.toFixed(2)}
          </span>
        </div>
        
        <div className="h-px w-full bg-surface-hover" />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-text-muted">
            <Users size={18} />
            <span className="font-medium">Split ({totalAdults} Adults)</span>
          </div>
          <span className="text-xl font-inter font-bold tabular-numbers text-text-main">
            ${costPerAdult.toFixed(2)} <span className="text-sm font-normal text-text-muted">/ea</span>
          </span>
        </div>
      </div>
    </section>
  );
}