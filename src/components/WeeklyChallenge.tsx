import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Users, Timer, Star, Film, ChevronRight, Sparkles, TrendingUp, Medal } from 'lucide-react';
import { Entry } from '../types';
import { cn } from '../lib/utils';

interface WeeklyChallengeProps {
  entries: Entry[];
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  watched: number;
  points: number;
  isMe?: boolean;
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { id: '1', name: 'CinemaGeek', avatar: 'https://picsum.photos/seed/1/100/100', watched: 12, points: 2400 },
  { id: '2', name: 'MovieMaster', avatar: 'https://picsum.photos/seed/2/100/100', watched: 10, points: 2100 },
  { id: '3', name: 'FilmFanatic', avatar: 'https://picsum.photos/seed/3/100/100', watched: 8, points: 1800 },
  { id: '4', name: 'DirectorCut', avatar: 'https://picsum.photos/seed/4/100/100', watched: 7, points: 1500 },
];

export function WeeklyChallenge({ entries }: WeeklyChallengeProps) {
  const [activeTab, setActiveTab] = useState<'challenge' | 'leaderboard'>('challenge');

  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyEntries = entries.filter(e => e.status === 'Completed' && new Date(e.watchedDate || 0) >= startOfWeek);
  const weeklyCount = weeklyEntries.length;
  const weeklyGoal = 3;
  const progress = Math.min((weeklyCount / weeklyGoal) * 100, 100);

  const myStats: LeaderboardUser = {
    id: 'me',
    name: 'You',
    avatar: 'https://picsum.photos/seed/me/100/100',
    watched: weeklyCount,
    points: weeklyCount * 200,
    isMe: true
  };

  const leaderboard = [...MOCK_LEADERBOARD, myStats].sort((a, b) => b.points - a.points);
  const myRank = leaderboard.findIndex(u => u.isMe) + 1;

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-display">Weekly Arena</h2>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] ml-16">Compete with cinephiles worldwide</p>
        </div>
        
        <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('challenge')}
            className={cn(
              "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'challenge' ? "bg-blue-500 text-white shadow-lg" : "text-gray-500 hover:text-white"
            )}
          >
            Challenge
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={cn(
              "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'leaderboard' ? "bg-blue-500 text-white shadow-lg" : "text-gray-500 hover:text-white"
            )}
          >
            Leaderboard
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'challenge' ? (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Main Challenge Card */}
            <div className="relative bg-zinc-900/30 border border-white/5 rounded-[3rem] p-12 overflow-hidden group">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/10 transition-all" />
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                      <Timer className="w-3 h-3 text-yellow-500" />
                      <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">4 Days Left</span>
                    </div>
                    <h3 className="text-5xl font-black text-white uppercase tracking-tight font-display leading-none">
                      The French <br /> Connection
                    </h3>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-relaxed max-w-md">
                      Watch 3 movies from French directors this week to earn the "Francophile" badge and 500 bonus points.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white">{weeklyCount}</span>
                        <span className="text-lg font-bold text-gray-500 uppercase tracking-widest">/ {weeklyGoal}</span>
                      </div>
                      <span className="text-xs font-black text-yellow-500 uppercase tracking-widest">{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Total Points', value: myStats.points, icon: Star, color: 'text-yellow-500' },
                    { label: 'Rank', value: `#${myRank}`, icon: Medal, color: 'text-blue-500' },
                    { label: 'Streak', value: '2w', icon: TrendingUp, color: 'text-green-500' },
                    { label: 'Badges', value: '12', icon: Trophy, color: 'text-purple-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-2">
                      <stat.icon className={cn("w-5 h-5", stat.color)} />
                      <p className="text-2xl font-black text-white">{stat.value}</p>
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rewards Section */}
            <div className="space-y-8">
              <h4 className="text-2xl font-black text-white uppercase tracking-tight font-display flex items-center gap-4">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Potential Rewards
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Francophile Badge', desc: 'Unlock the exclusive French cinema badge.', points: '+500 pts' },
                  { title: 'Profile Glow', desc: 'Get a golden border for your profile card.', points: '+200 pts' },
                  { title: 'Double XP', desc: 'Earn 2x points for every movie next week.', points: 'Bonus' },
                ].map((reward, i) => (
                  <div key={i} className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 space-y-4 group hover:bg-zinc-900/50 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Trophy className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-lg font-black text-white uppercase tracking-tight">{reward.title}</h5>
                        <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest">{reward.points}</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">{reward.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-zinc-900/30 border border-white/5 rounded-[3rem] overflow-hidden"
          >
            <div className="p-12 border-b border-white/5 bg-gradient-to-r from-blue-500/5 to-transparent flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight font-display">Global Leaderboard</h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Updated every 15 minutes</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Your Rank</p>
                  <p className="text-2xl font-black text-white">#{myRank}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-2">
                {leaderboard.map((user, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={user.id}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-[2rem] transition-all group",
                      user.isMe ? "bg-blue-500/10 border border-blue-500/20" : "hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-8">
                      <span className={cn(
                        "text-2xl font-black w-8 text-center",
                        index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-orange-500" : "text-gray-600"
                      )}>
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                            {user.name}
                            {user.isMe && <span className="px-2 py-0.5 bg-blue-500 text-[8px] rounded-full">YOU</span>}
                          </h4>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{user.watched} titles this week</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-white uppercase tracking-tight">{user.points.toLocaleString()}</p>
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Total Points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
