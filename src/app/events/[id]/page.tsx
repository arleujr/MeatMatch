"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBbqEventById, updateBbqEventActuals } from "@/features/calculator/services/eventService";
import { Calendar, Users, ShoppingBag, DollarSign, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface BbqEventData {
  id: string;
  title: string;
  event_date: string;
  guest_data: {
    guestCount: { adult_male: number; adult_female: number; child: number };
    durationInHours: number;
  };
  results_data: Record<string, number>;
  actual_data?: Record<string, { actualQty: number; unitPrice: number }>;
  total_cost?: number;
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [event, setEvent] = useState<BbqEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Local state to handle dynamic receipt inputs
  const [inputs, setInputs] = useState<Record<string, { actualQty: string; unitPrice: string }>>({});

  useEffect(() => {
    if (!id) return;
    
    getBbqEventById(id as string)
      .then((data) => {
        setEvent(data as BbqEventData);
        
        // Populate inputs with existing actual data or default empty strings
        const initialInputs: Record<string, { actualQty: string; unitPrice: string }> = {};
        Object.keys(data.results_data).forEach((item) => {
          const existing = data.actual_data?.[item];
          initialInputs[item] = {
            // Convert grams/ml to standard kg/L for user friendliness
            actualQty: existing ? (existing.actualQty / 1000).toString() : (data.results_data[item] / 1000).toString(),
            unitPrice: existing ? existing.unitPrice.toString() : "",
          };
        });
        setInputs(initialInputs);
      })
      .catch(() => router.push("/dashboard"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow py-24">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!event) return null;

  const handleInputChange = (item: string, field: "actualQty" | "unitPrice", value: string) => {
    setInputs((prev) => ({
      ...prev,
      [item]: { ...prev[item], [field]: value },
    }));
  };

  // Calculate live total based on user inputs
  let calculatedTotalCost = 0;
  Object.keys(event.results_data).forEach((item) => {
    const qty = parseFloat(inputs[item]?.actualQty) || 0;
    const price = parseFloat(inputs[item]?.unitPrice) || 0;
    calculatedTotalCost += qty * price;
  });

  const totalAdults = event.guest_data.guestCount.adult_male + event.guest_data.guestCount.adult_female;
  const costPerAdult = totalAdults > 0 ? calculatedTotalCost / totalAdults : 0;

  const handleSaveActuals = async () => {
    setIsSaving(true);
    try {
      const formattedActuals: Record<string, { actualQty: number; unitPrice: number }> = {};
      
      Object.keys(event.results_data).forEach((item) => {
        formattedActuals[item] = {
          // Convert back to grams/ml for database consistency (ML logic alignment)
          actualQty: (parseFloat(inputs[item]?.actualQty) || 0) * 1000,
          unitPrice: parseFloat(inputs[item]?.unitPrice) || 0,
        };
      });

      await updateBbqEventActuals(event.id, formattedActuals, calculatedTotalCost);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to update receipt metrics.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Navigation Top Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <span className="text-xs bg-surface border border-surface-hover px-3 py-1.5 rounded-full text-text-muted font-mono">
          ID: {event.id.slice(0, 8)}
        </span>
      </div>

      {/* Meta Briefing Card */}
      <div className="bg-surface border border-surface-hover rounded-2xl p-6 shadow-sm space-y-4">
        <h1 className="font-jakarta text-3xl font-bold tracking-tight text-text-main">{event.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            <span>{new Date(event.event_date).toLocaleDateString('en-US', { timeZone: 'UTC', dateStyle: 'medium' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} />
            <span>{totalAdults} Adults, {event.guest_data.guestCount.child} Children</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Receipt Entry (Actuals Form) */}
        <section className="bg-surface border border-surface-hover rounded-2xl p-6 h-fit space-y-6">
          <div className="flex items-center gap-2 border-b border-surface-hover/50 pb-3">
            <ShoppingBag className="text-primary" size={20} />
            <h2 className="font-jakarta text-xl font-semibold">Market Receipt Details</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(event.results_data).map(([item, estimatedGramsOrMl]) => {
              const formattedKey = item.replace('_', ' ').toUpperCase();
              const isDrink = item === "beer" || item === "soda";
              const unitLabel = isDrink ? "L" : "kg";

              return (
                <div key={item} className="p-4 bg-background rounded-xl border border-surface-hover space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-text-main">{formattedKey}</span>
                    <span className="text-xs text-text-muted">
                      Estimated: {(estimatedGramsOrMl / 1000).toFixed(isDrink ? 1 : 2)}{unitLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Qty Bought ({unitLabel})</label>
                      <input
                        type="number"
                        step="0.01"
                        value={inputs[item]?.actualQty || ""}
                        onChange={(e) => handleInputChange(item, "actualQty", e.target.value)}
                        className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Price per {unitLabel}</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-text-muted">$</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={inputs[item]?.unitPrice || ""}
                          onChange={(e) => handleInputChange(item, "unitPrice", e.target.value)}
                          className="w-full bg-surface border border-surface-hover rounded-lg pl-6 pr-3 py-2 text-sm text-right focus:outline-none focus:border-primary font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSaveActuals}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : success ? (
              <>
                <CheckCircle2 size={20} />
                Metrics Locked & Saved!
              </>
            ) : (
              "Save Purchases & Metrics"
            )}
          </button>
        </section>

        {/* Right Column: Dynamic Bill Splitting Results */}
        <section className="md:sticky md:top-8 h-fit bg-surface border border-surface-hover rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-surface-hover/50 pb-3">
            <DollarSign className="text-primary" size={20} />
            <h2 className="font-jakarta text-xl font-semibold">Definitive Cost Split</h2>
          </div>

          <p className="text-text-muted text-sm leading-relaxed">
            Fill in the actual grocery receipt metrics on the left. The settlement ledger below updates reatively in real-time.
          </p>

          <div className="bg-background rounded-2xl p-5 border border-surface-hover space-y-5">
            <div className="flex justify-between items-end">
              <span className="text-text-muted font-medium text-sm">Receipt Grand Total</span>
              <span className="text-3xl font-jakarta font-bold tabular-numbers text-primary">
                ${calculatedTotalCost.toFixed(2)}
              </span>
            </div>
            
            <div className="h-px w-full bg-surface-hover/60" />

            <div className="flex justify-between items-center">
              <span className="text-text-muted font-medium text-sm">Individual Share ({totalAdults} Adults)</span>
              <div className="text-right">
                <span className="text-2xl font-inter font-extrabold tabular-numbers text-text-main">
                  ${costPerAdult.toFixed(2)}
                </span>
                <span className="text-xs text-text-muted block mt-0.5">per person</span>
              </div>
            </div>
          </div>

          {/* Value Prop Alert for the portfolio */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl text-xs text-text-muted leading-relaxed">
            <strong className="text-primary block mb-1">🚀 Machine Learning Core Note:</strong>
            Saving these purchase metrics records the variance between prediction models and real habits. This data loop triggers your serverless model adjustments.
          </div>
        </section>

      </div>
    </div>
  );
}