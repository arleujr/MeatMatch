"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { supabase } from "@/shared/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        // Without email confirmation required, the user is automatically logged in!
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-surface border border-surface-hover p-8 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Subtle decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-dark via-primary to-yellow-300" />

        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-background/50 hover:bg-surface-hover text-text-muted hover:text-text-main rounded-full transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-8 mt-2">
          <h2 className="font-jakarta text-3xl font-extrabold tracking-tight text-text-main mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-text-muted text-sm">
            {isLogin 
              ? "Enter your details to access your BBQ history." 
              : "Join to save presets and split costs effortlessly."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium text-center animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2 relative group">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-background border border-surface-hover rounded-xl pl-11 pr-4 py-3.5 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div className="space-y-2 relative group">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-surface-hover rounded-xl pl-11 pr-4 py-3.5 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2 relative group">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-surface-hover rounded-xl pl-11 pr-4 py-3.5 text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative flex items-center justify-center bg-primary hover:bg-primary-dark text-background font-bold py-4 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-lg shadow-primary/20 cursor-pointer overflow-hidden"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-surface-hover text-center">
          <p className="text-text-muted text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-primary hover:text-primary-dark font-semibold transition-colors cursor-pointer"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}