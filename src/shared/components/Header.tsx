"use client";

import { useState, useEffect } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { supabase } from '@/shared/lib/supabase';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { AuthModal } from '@/features/auth/AuthModal';
import Link from 'next/link';

export function Header() {
  const { user, setUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. Get the session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Set up a real-time listener for Auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <header className="flex items-center justify-between py-6 mb-8 border-b border-surface-hover animate-in fade-in duration-500">
      <div className="font-jakarta text-2xl font-bold tracking-tight">
        Meat<span className="text-primary">Match</span>
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-3">
            {/* New link directing to Dashboard */}
            <Link
              href="/dashboard"
              className="text-sm font-semibold bg-surface hover:bg-surface-hover border border-surface-hover px-4 py-2 rounded-lg transition-colors"
            >
              My BBQs
            </Link>
            <button
              onClick={() => {
                supabase.auth.signOut();
                window.location.href = "/"; // Force return to home on signout
              }}
              className="p-2 text-text-muted hover:text-red-400 transition-colors cursor-pointer bg-surface border border-surface-hover rounded-lg"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold bg-surface hover:bg-surface-hover border border-surface-hover px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <UserIcon size={16} />
            Sign In
          </button>
        )}
      </div>

      {/* The Modal we created earlier */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}