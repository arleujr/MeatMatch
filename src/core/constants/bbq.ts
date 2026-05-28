import { GuestType, ConsumptionBaseline } from '../types/bbq';

/**
 * Standard consumption baselines for a 4-hour BBQ event.
 * These serve as the "Cold Start" (Seed Data) before the ML engine
 * personalizes the weights based on user feedback.
 */
export const BASE_CONSUMPTION_4H: Record<GuestType, ConsumptionBaseline> = {
  adult_male: {
    proteinTotal: 500, // 500g of total meat
    sidesTotal: 150,   // 150g of sides (garlic bread, farofa)
    beerTotal: 2000,   // 2 liters
    nonAlcoholicTotal: 500, // 500ml of water/soda
  },
  adult_female: {
    proteinTotal: 400,
    sidesTotal: 150,
    beerTotal: 1500,
    nonAlcoholicTotal: 500,
  },
  child: {
    proteinTotal: 200,
    sidesTotal: 100,
    beerTotal: 0, // Children do not consume alcohol
    nonAlcoholicTotal: 1000,
  },
};

/**
 * Multiplier applied per additional hour beyond the standard 4 hours.
 * Consumption decreases logarithmically over time, so we don't scale linearly.
 * e.g., 5th hour adds 15% meat, not 25%.
 */
export const HOURLY_DECAY_RATE = {
  protein: 0.15, 
  drinks: 0.25,  // People keep drinking more than they keep eating
};