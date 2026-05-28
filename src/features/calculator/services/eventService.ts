import { supabase } from '@/shared/lib/supabase';

/**
 * Fetches a single BBQ event by its unique UUID.
 */
export async function getBbqEventById(eventId: string) {
  const { data, error } = await supabase
    .from('bbq_events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }

  return data;
}

/**
 * Updates the BBQ event with actual market receipt data and total cost.
 */
export async function updateBbqEventActuals(
  eventId: string, 
  actualData: Record<string, { actualQty: number; unitPrice: number }>, 
  totalCost: number
) {
  const { data, error } = await supabase
    .from('bbq_events')
    .update({
      actual_data: actualData,
      total_cost: totalCost
    })
    .eq('id', eventId)
    .select()
    .single();

  if (error) {
    console.error("Error updating event actuals:", error);
    throw error;
  }

  return data;
}