import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

/**
 * Global state for Authentication.
 * Keeps track of the currently logged-in user across the application.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));