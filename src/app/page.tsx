"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCalculatorStore } from "@/features/calculator/store/useCalculatorStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { saveBbqEvent } from "@/features/calculator/services/bbqService";
import { Counter } from "@/shared/components/Counter";
import { ItemCard } from "@/shared/components/ItemCard";
import { ItemCategory } from "@/core/types/bbq";
import { Save, Loader2 } from "lucide-react";

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
  const { user } = useAuthStore();
  const router = useRouter(); // Next.js App Router navigation hook
  
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]); 
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasResults = Object.keys(store.results).length > 0;

  const handleSaveEvent = async () => {
    if (!user) {
      setError("Please sign in to save your BBQ event.");
      return;
    }
    if (!eventTitle.trim()) {
      setError("Please give your event a name.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const parameters = {
        guestCount: store.guestCount,
        selectedMeats: store.selectedMeats,
        selectedDrinks: store.selectedDrinks,
        durationInHours: store.durationInHours,
      };

      // Save to Supabase and retrieve the generated row data
      const savedData = await saveBbqEvent(user.id, eventTitle, eventDate, parameters, store.results);
      
      // Clear current store state before leaving
      store.resetCalculator();
      
      // Redirect user instantly to the dynamic Event Details page using its Postgres UUID
      router.push(`/events/${savedData.id}`);
    } catch (err: any) {
      setError("Failed to save event. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="font-jakarta text-3xl font-bold tracking-tight">
          BBQ <span className="text-primary">Calculator</span>
        </h1>
        <p className="text-text-muted">Adjust the parameters to get your precise shopping list.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="space-y-8">
          <section className="bg-surface border border-surface-hover rounded-2xl p-6">
            <h2 className="font-jakarta text-xl font-semibold mb-4">Guests & Time</h2>
            <div className="space-y-2 divide-y divide-surface-hover/50">
              <Counter label="Adults (Men)" value={store.guestCount.adult_male} onChange={(val) => store.updateGuestCount("adult_male", val)} />
              <Counter label="Adults (Women)" value={store.guestCount.adult_female} onChange={(val) => store.updateGuestCount("adult_female", val)} />
              <Counter label="Children" value={store.guestCount.child} onChange={(val) => store.updateGuestCount("child", val)} />
              <Counter label="Duration (Hours)" description="Peak consumption is in the first 4h" value={store.durationInHours} min={1} max={12} onChange={store.updateDuration} />
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="font-jakarta text-xl font-semibold mb-3">Meats</h2>
              <div className="grid grid-cols-2 gap-3">
                {MEAT_OPTIONS.map((meat) => (
                  <ItemCard key={meat.id} label={meat.label} isSelected={store.selectedMeats.includes(meat.id)} onClick={() => store.toggleMeat(meat.id)} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-jakarta text-xl font-semibold mb-3">Drinks</h2>
              <div className="grid grid-cols-2 gap-3">
                {DRINK_OPTIONS.map((drink) => (
                  <ItemCard key={drink.id} label={drink.label} isSelected={store.selectedDrinks.includes(drink.id)} onClick={() => store.toggleDrink(drink.id)} />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Output / Results */}
        <div className="md:sticky md:top-8 h-fit space-y-6">
          <section className="bg-surface border border-surface-hover rounded-2xl p-6 shadow-xl">
            <h2 className="font-jakarta text-xl font-semibold mb-6 flex items-center justify-between">
              Shopping List
              {hasResults && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                  Auto-calculated
                </span>
              )}
            </h2>

            {!hasResults ? (
              <div className="text-center py-12 text-text-muted border-2 border-dashed border-surface-hover rounded-xl">
                <p>Add guests and select items to see the magic happen.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(store.results).map(([key, value]) => {
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

          {/* Save Section */}
          {hasResults && (
            <section className="bg-surface border border-surface-hover rounded-2xl p-6 shadow-lg animate-in slide-in-from-bottom-4">
              <h3 className="font-jakarta text-lg font-semibold mb-4">Save Preset</h3>
              
              {!user ? (
                <div className="text-sm text-text-muted bg-background p-4 rounded-xl border border-surface-hover text-center">
                  Sign in from the top menu to lock in this BBQ and personalize the expenses.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="e.g., Family Sunday Roast"
                      className="col-span-1 sm:col-span-2 w-full bg-background border border-surface-hover rounded-xl px-4 py-3 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                    />
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="col-span-1 w-full bg-background border border-surface-hover rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  
                  {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
                  
                  <button
                    onClick={handleSaveEvent}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Lock Calculations & Proceed"
                    )}
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}