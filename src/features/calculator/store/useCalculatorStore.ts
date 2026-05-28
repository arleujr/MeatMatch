import { create } from 'zustand';
import { BbqParameters, ItemCategory, GuestType } from '@/core/types/bbq';
import { calculateBbqRequirements } from '@/core/utils/calculator';

/**
 * State definition for the MeatMatch BBQ Calculator.
 * Represents both the reactive input data and the calculated output requirements.
 */
interface CalculatorState {
  // State variables
  guestCount: Record<GuestType, number>;
  selectedMeats: ItemCategory[];
  selectedDrinks: ItemCategory[];
  durationInHours: number;
  results: Record<string, number>;

  // Actions / Mutations
  updateGuestCount: (type: GuestType, count: number) => void;
  toggleMeat: (meat: ItemCategory) => void;
  toggleDrink: (drink: ItemCategory) => void;
  updateDuration: (hours: number) => void;
  resetCalculator: () => void;
}

// Initial state baseline for clean resets and defaults
const INITIAL_PARAMETERS: BbqParameters = {
  guestCount: {
    adult_male: 0,
    adult_female: 0,
    child: 0,
  },
  selectedMeats: [],
  selectedDrinks: [],
  durationInHours: 4, // Default standard event duration
};

/**
 * Zustand store executing the state management for the calculator feature.
 * Automatically recalculates domain requirements on every user interaction
 * to achieve reactive real-time UI updates.
 */
export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  ...INITIAL_PARAMETERS,
  results: {},

  updateGuestCount: (type, count) => {
    // Ensure we don't allow negative guest counts
    const sanitizedCount = Math.max(0, count);
    
    set((state) => {
      const nextGuestCount = { ...state.guestCount, [type]: sanitizedCount };
      
      return {
        guestCount: nextGuestCount,
        results: calculateBbqRequirements({
          guestCount: nextGuestCount,
          selectedMeats: state.selectedMeats,
          selectedDrinks: state.selectedDrinks,
          durationInHours: state.durationInHours,
        }),
      };
    });
  },

  toggleMeat: (meat) => {
    set((state) => {
      const isSelected = state.selectedMeats.includes(meat);
      const nextMeats = isSelected
        ? state.selectedMeats.filter((m) => m !== meat)
        : [...state.selectedMeats, meat];

      return {
        selectedMeats: nextMeats,
        results: calculateBbqRequirements({
          guestCount: state.guestCount,
          selectedMeats: nextMeats,
          selectedDrinks: state.selectedDrinks,
          durationInHours: state.durationInHours,
        }),
      };
    });
  },

  toggleDrink: (drink) => {
    set((state) => {
      const isSelected = state.selectedDrinks.includes(drink);
      const nextDrinks = isSelected
        ? state.selectedDrinks.filter((d) => d !== drink)
        : [...state.selectedDrinks, drink];

      return {
        selectedDrinks: nextDrinks,
        results: calculateBbqRequirements({
          guestCount: state.guestCount,
          selectedMeats: state.selectedMeats,
          selectedDrinks: nextDrinks,
          durationInHours: state.durationInHours,
        }),
      };
    });
  },

  updateDuration: (hours) => {
    // Restrict duration bounds reasonably (e.g., between 1 and 24 hours)
    const sanitizedHours = Math.min(24, Math.max(1, hours));

    set((state) => ({
      durationInHours: sanitizedHours,
      results: calculateBbqRequirements({
        guestCount: state.guestCount,
        selectedMeats: state.selectedMeats,
        selectedDrinks: state.selectedDrinks,
        durationInHours: sanitizedHours,
      }),
    }));
  },

  resetCalculator: () => {
    set({
      ...INITIAL_PARAMETERS,
      results: {},
    });
  },
}));