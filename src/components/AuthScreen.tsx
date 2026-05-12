import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Film, User, ArrowRight } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AuthScreenProps {
  onLogin: (userId: string, displayName?: string) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    console.log("Google Login initiated...");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Login success for:", result.user.email);
      onLogin(result.user.uid, result.user.displayName || result.user.email || result.user.uid);
    } catch (error: any) {
      console.error("Google Sign-In Error Details:", error.code, error.message);
      if (error.code !== 'auth/cancelled-popup-request') {
        alert(`Login failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      onLogin(userId.trim().toLowerCase(), userId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-blue-500 selection:text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white text-black rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.2)] mb-4">
              <Film className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter font-display leading-none">
              CineTrack
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
              Access your cinematic journey
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleLogin}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {isLoading ? "Authenticating..." : "Sign in with Google"}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest text-gray-600"><span className="bg-zinc-900/50 px-4">OR CONTINUE WITH ID</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="ENTER USER ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-bold uppercase tracking-widest text-[10px] focus:outline-none focus:border-blue-500/50 focus:bg-zinc-800 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl flex items-center justify-center gap-2 transition-all"
              >
                Start Tracking
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <p className="text-center text-gray-600 text-[8px] font-bold uppercase tracking-[0.2em]">
            No password required. Your data is saved to this ID.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
