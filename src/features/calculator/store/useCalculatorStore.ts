import { create } from 'zustand';
import { BbqParameters, ItemCategory, GuestType } from '@/core/types/bbq';
import { calculateBbqRequirements } from '@/core/utils/calculator';

interface CalculatorState {
  guestCount: Record<GuestType, number>;
  selectedMeats: ItemCategory[];
  selectedDrinks: ItemCategory[];
  durationInHours: number;
  results: Record<string, number>;
  
  // New Financial State
  unitPrices: Record<string, number>;
  
  updateGuestCount: (type: GuestType, count: number) => void;
  toggleMeat: (meat: ItemCategory) => void;
  toggleDrink: (drink: ItemCategory) => void;
  updateDuration: (hours: number) => void;
  updateUnitPrice: (item: string, price: number) => void;
  resetCalculator: () => void;
}

// Default estimated prices (Currency agnostic, but modeled around realistic regional BRL values for the MVP)
const DEFAULT_PRICES: Record<string, number> = {
  beef: 45.00,      // per kg
  pork: 25.00,      // per kg
  chicken: 20.00,   // per kg
  sausage: 28.00,   // per kg
  garlic_bread: 35.00, // per kg
  coal: 6.00,       // per kg
  beer: 12.00,      // per liter
  soda: 6.00,       // per liter
};

const INITIAL_PARAMETERS: BbqParameters = {
  guestCount: {
    adult_male: 0,
    adult_female: 0,
    child: 0,
  },
  selectedMeats: [],
  selectedDrinks: [],
  durationInHours: 4,
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  ...INITIAL_PARAMETERS,
  results: {},
  unitPrices: DEFAULT_PRICES,

  updateGuestCount: (type, count) => {
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

  // New action to handle price changes
  updateUnitPrice: (item, price) => {
    const sanitizedPrice = Math.max(0, price);
    set((state) => ({
      unitPrices: {
        ...state.unitPrices,
        [item]: sanitizedPrice,
      }
    }));
  },

  resetCalculator: () => {
    set({
      ...INITIAL_PARAMETERS,
      results: {},
      unitPrices: DEFAULT_PRICES,
    });
  },
}));