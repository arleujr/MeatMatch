"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { getUserBbqEvents } from "@/features/calculator/services/dashboardService";
import { Calendar, Users, ArrowRight, Plus, Loader2 } from "lucide-react";

interface DashboardEvent {
  id: string;
  title: string;
  event_date: string;
  guest_data: {
    guestCount: {
      adult_male: number;
      adult_female: number;
      child: number;
    };
  };
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Security check: Redirect to home if a non-logged user attempts to access the dashboard
    if (!user) {
      router.push("/");
      return;
    }

    getUserBbqEvents()
      .then((data) => setEvents(data as DashboardEvent[]))
      .catch(() => alert("Failed to fetch history logs."))
      .finally(() => setLoading(false));
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow py-24">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-jakarta text-3xl font-bold tracking-tight">My BBQs</h1>
          <p className="text-text-muted">Manage your saved events and financial split histories.</p>
        </div>
        <Link 
          href="/"
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Calculate
        </Link>
      </div>

      {/* Empty State vs Event List Grid */}
      {events.length === 0 ? (
        <div className="text-center py-16 text-text-muted border-2 border-dashed border-surface-hover rounded-2xl bg-surface/30">
          <p className="mb-4">No historical data recorded yet.</p>
          <Link href="/" className="text-primary hover:underline font-medium text-sm">
            Launch your first planning engine →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((event) => {
            const totalGuests = 
              event.guest_data.guestCount.adult_male + 
              event.guest_data.guestCount.adult_female + 
              event.guest_data.guestCount.child;

            return (
              <Link 
                key={event.id}
                href={`/events/${event.id}`}
                className="group relative flex flex-col justify-between p-6 bg-surface border border-surface-hover hover:border-text-muted/30 rounded-2xl shadow-sm transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <Calendar size={14} />
                    {new Date(event.event_date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h2 className="font-jakarta text-xl font-bold text-text-main group-hover:text-primary transition-colors truncate">
                    {event.title}
                  </h2>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-hover/40 text-text-muted text-sm">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Users size={16} />
                    <span>{totalGuests} Attendees</span>
                  </div>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform text-text-muted group-hover:text-primary" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}