"use client";

import { useCalculatorStore } from "@/features/calculator/store/useCalculatorStore";
import { Counter } from "@/shared/components/Counter";
import { ItemCard } from "@/shared/components/ItemCard";
import { ItemCategory } from "@/core/types/bbq";

const MEAT_OPTIONS: { id: ItemCategory; label: string }[] = [
  { id: "beef", label: "Beef (Boi)" },
  { id: "pork", label: "Pork (Porco)" },
  { id: "chicken", label: "Chicken (Frango)" },
  { id: "sausage", label: "Sausage (Linguiça)" },
];

const DRINK_OPTIONS: { id: ItemCategory; label: string }[] = [
  { id: "beer", label: "Beer (Cerveja)" },
  { id: "soda", label: "Soda & Water" },
];

export default function Home() {
  const store = useCalculatorStore();

  return (
    <div className="flex flex-col flex-grow space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-jakarta text-3xl font-bold tracking-tight">
          BBQ <span className="text-primary">Calculator</span>
        </h1>
        <p className="text-text-muted">Adjust the parameters to get your precise shopping list.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="space-y-8">
          
          {/* Guests Section */}
          <section className="bg-surface border border-surface-hover rounded-2xl p-6">
            <h2 className="font-jakarta text-xl font-semibold mb-4">Guests & Time</h2>
            <div className="space-y-2 divide-y divide-surface-hover/50">
              <Counter 
                label="Adults (Men)" 
                value={store.guestCount.adult_male} 
                onChange={(val) => store.updateGuestCount("adult_male", val)} 
              />
              <Counter 
                label="Adults (Women)" 
                value={store.guestCount.adult_female} 
                onChange={(val) => store.updateGuestCount("adult_female", val)} 
              />
              <Counter 
                label="Children" 
                value={store.guestCount.child} 
                onChange={(val) => store.updateGuestCount("child", val)} 
              />
              <Counter 
                label="Duration (Hours)" 
                description="Peak consumption is in the first 4h"
                value={store.durationInHours} 
                min={1}
                max={12}
                onChange={store.updateDuration} 
              />
            </div>
          </section>

          {/* Menu Section */}
          <section className="space-y-6">
            <div>
              <h2 className="font-jakarta text-xl font-semibold mb-3">Meats</h2>
              <div className="grid grid-cols-2 gap-3">
                {MEAT_OPTIONS.map((meat) => (
                  <ItemCard
                    key={meat.id}
                    label={meat.label}
                    isSelected={store.selectedMeats.includes(meat.id)}
                    onClick={() => store.toggleMeat(meat.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-jakarta text-xl font-semibold mb-3">Drinks</h2>
              <div className="grid grid-cols-2 gap-3">
                {DRINK_OPTIONS.map((drink) => (
                  <ItemCard
                    key={drink.id}
                    label={drink.label}
                    isSelected={store.selectedDrinks.includes(drink.id)}
                    onClick={() => store.toggleDrink(drink.id)}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Output / Results */}
        <div className="md:sticky md:top-8 h-fit">
          <section className="bg-surface border border-surface-hover rounded-2xl p-6 shadow-xl">
            <h2 className="font-jakarta text-xl font-semibold mb-6 flex items-center justify-between">
              Shopping List
              {Object.keys(store.results).length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                  Auto-calculated
                </span>
              )}
            </h2>

            {Object.keys(store.results).length === 0 ? (
              <div className="text-center py-12 text-text-muted border-2 border-dashed border-surface-hover rounded-xl">
                <p>Add guests and select items to see the magic happen.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(store.results).map(([key, value]) => {
                  // Format display based on item type
                  const isDrink = key === "beer" || key === "soda";
                  const unit = isDrink ? "L" : "kg";
                  const displayValue = isDrink ? (value / 1000).toFixed(1) : (value / 1000).toFixed(2);
                  const formattedKey = key.replace('_', ' ').toUpperCase();

                  return (
                    <div key={key} className="flex justify-between items-center p-3 bg-background rounded-lg border border-surface-hover">
                      <span className="font-medium text-text-muted">{formattedKey}</span>
                      <span className="font-bold font-inter tabular-numbers text-lg">
                        {displayValue} <span className="text-sm font-normal text-text-muted">{unit}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  );
}