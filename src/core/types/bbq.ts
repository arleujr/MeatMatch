/**
 * Core domain types for the MeatMatch BBQ Calculator.
 * These interfaces ensure data consistency across the frontend, 
 * Supabase backend, and the Python ML Microservice.
 */

export type GuestType = 'adult_male' | 'adult_female' | 'child';

export type ItemCategory = 
  | 'beef' 
  | 'pork' 
  | 'chicken' 
  | 'sausage' 
  | 'garlic_bread' 
  | 'coal' 
  | 'beer' 
  | 'soda';

export interface ConsumptionBaseline {
  proteinTotal: number; // in grams
  sidesTotal: number; // in grams
  beerTotal: number; // in milliliters
  nonAlcoholicTotal: number; // in milliliters
}

export interface BbqParameters {
  guestCount: Record<GuestType, number>;
  selectedMeats: ItemCategory[];
  selectedDrinks: ItemCategory[];
  durationInHours: number;
}