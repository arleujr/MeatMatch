import { BbqParameters, ItemCategory, GuestType } from '../types/bbq';
import { BASE_CONSUMPTION_4H, HOURLY_DECAY_RATE } from '../constants/bbq';

/**
 * Calculates the exact quantity of each item needed for the BBQ.
 * This is a pure function, completely decoupled from the UI (React).
 * Later, the ML Engine weights will be injected here as an optional parameter.
 */
export function calculateBbqRequirements(params: BbqParameters): Record<string, number> {
  let baseProtein = 0;
  let baseSides = 0;
  let baseBeer = 0;
  let baseNonAlcoholic = 0;

  // 1. Aggregate basic needs based on a standard 4-hour event
  const guestTypes = Object.keys(params.guestCount) as GuestType[];
  
  guestTypes.forEach((type) => {
    const count = params.guestCount[type];
    const baseline = BASE_CONSUMPTION_4H[type];

    baseProtein += count * baseline.proteinTotal;
    baseSides += count * baseline.sidesTotal;
    baseBeer += count * baseline.beerTotal;
    baseNonAlcoholic += count * baseline.nonAlcoholicTotal;
  });

  // 2. Apply the Time Modifier (Events longer than 4 hours)
  // We use a linear decay simulation for the MVP.
  const extraHours = Math.max(0, params.durationInHours - 4);
  const proteinMultiplier = 1 + (extraHours * HOURLY_DECAY_RATE.protein);
  const drinksMultiplier = 1 + (extraHours * HOURLY_DECAY_RATE.drinks);

  const totalProtein = baseProtein * proteinMultiplier;
  const totalBeer = baseBeer * drinksMultiplier;
  const totalNonAlcoholic = baseNonAlcoholic * drinksMultiplier;
  const totalSides = baseSides * proteinMultiplier;

  // 3. Distribute the aggregated weights into specific selected items
  const results: Record<string, number> = {};

  // Distribute Meat (Evenly for MVP. ML will optimize these ratios per user later)
  if (params.selectedMeats.length > 0) {
    const proteinPerMeatType = totalProtein / params.selectedMeats.length;
    params.selectedMeats.forEach(meat => {
      // Rounding to nearest integer for clean UI display (grams)
      results[meat] = Math.round(proteinPerMeatType); 
    });

    // Coal calculation: Roughly 1.5kg of coal per 1kg of total meat
    results['coal'] = Math.round((totalProtein / 1000) * 1500);
  }

  // Assign Drinks (ml)
  if (params.selectedDrinks.includes('beer')) results['beer'] = Math.round(totalBeer);
  if (params.selectedDrinks.includes('soda')) results['soda'] = Math.round(totalNonAlcoholic);
  
  // Assign Sides (grams)
  if (params.selectedMeats.length > 0) { // Only add sides if there's a BBQ happening
    results['garlic_bread'] = Math.round(totalSides);
  }

  return results;
}