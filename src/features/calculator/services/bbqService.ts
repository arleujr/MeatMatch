import { supabase } from '@/shared/lib/supabase';
import { BbqParameters } from '@/core/types/bbq';

/**
 * Service responsible for interacting with the bbq_events table.
 * Abstracts the Supabase logic away from the UI components.
 */
export async function saveBbqEvent(
  userId: string, 
  title: string, 
  eventDate: string, // <-- Nova propriedade adicionada aqui
  parameters: BbqParameters, 
  results: Record<string, number>
) {
  const { data, error } = await supabase
    .from('bbq_events')
    .insert([
      {
        user_id: userId,
        title: title,
        event_date: eventDate, // <-- Enviando para o Postgres
        guest_data: parameters,
        results_data: results,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error saving BBQ event:", error);
    throw error;
  }

  return data;
}