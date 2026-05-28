import { supabase } from '@/shared/lib/supabase';

/**
 * Service mapping queries to retrieve all BBQ history logs 
 * belonging strictly to the authenticated request sender.
 */
export async function getUserBbqEvents() {
  const { data, error } = await supabase
    .from('bbq_events')
    .select('id, title, event_date, guest_data')
    .order('event_date', { ascending: false });

  if (error) {
    console.error("Error fetching dashboard events:", error);
    throw error;
  }

  return data;
}