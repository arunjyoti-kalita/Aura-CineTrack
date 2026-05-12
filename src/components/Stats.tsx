import React from 'react';
import { motion } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Entry } from '../types';
import { TYPE_COLORS } from '../constants';
import { cn } from '../lib/utils';

interface StatsProps {
  entries: Entry[];
}

export function Stats({ entries }: StatsProps) {
  const activeEntries = entries.filter(e => e.status === 'Completed' || e.status === 'Watching');
  const hasActiveEntries = activeEntries.length > 0;

  // Data processing
  const typeData = Object.entries(
    activeEntries.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const genreData = Object.entries(
    activeEntries.reduce((acc, curr) => {
      acc[curr.genre] = (acc[curr.genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))
   .sort((a, b) => b.value - a.value)
   .slice(0, 8);

  const platformData = Object.entries(
    activeEntries.reduce((acc, curr) => {
      acc[curr.platform] = (acc[curr.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const totalHours = Math.round(activeEntries.reduce((acc, curr) => {
    const time = curr.runtime * (curr.episodesWatched || 1);
    return acc + time;
  }, 0) / 60);

  const topActor = Object.entries(
    activeEntries.reduce((acc, curr) => {
      if (curr.leadActor && curr.leadActor !== 'N/A') acc[curr.leadActor] = (acc[curr.leadActor] || 0) + 1;
      if (curr.leadActress && curr.leadActress !== 'N/A') acc[curr.leadActress] = (acc[curr.leadActress] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const topDirector = Object.entries(
    activeEntries.reduce((acc, curr) => {
      if (curr.director && curr.director !== 'N/A') acc[curr.director] = (acc[curr.director] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const ratedEntries = entries.filter(e => e.myRating > 0);
  const avgRating = ratedEntries.length > 0 
    ? (ratedEntries.reduce((a, b) => a + b.myRating, 0) / ratedEntries.length).toFixed(1) 
    : '0.0';

  const GENRE_COLORS = [
    '#00f2ff', // neon-blue
    '#bc13fe', // neon-purple
    '#ff00ff', // neon-pink
    '#39ff14', // neon-green
    '#fff01f', // neon-yellow
    '#ff3131', // neon-red
    '#3b82f6', // blue-500
    '#a855f7', // purple-500
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase font-display">Insights & Stats</h2>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Deep dive into your personal cinematic universe</p>
      </div>

      {!hasActiveEntries && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neon-blue/10 border border-neon-blue/20 p-12 rounded-[3rem] text-center space-y-4"
        >
          <h3 className="text-3xl font-black text-white uppercase tracking-tight font-display">Start watching to unlock your stats!</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
            Complete movies or start watching series to see your viewing habits and statistics come to life!
          </p>
        </motion.div>
      )}

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Hours', value: `${totalHours}h`, sub: 'Estimated watch time', color: 'neon-blue' },
          { label: 'Top Actor', value: topActor, sub: 'Most watched lead', color: 'neon-purple' },
          { label: 'Top Director', value: topDirector, sub: 'Favourite creator', color: 'neon-green' },
          { label: 'Avg Rating', value: avgRating, sub: 'Across all content', color: 'neon-yellow' },
        ].map((stat, i) => (
          <div key={i} className={cn(
            "bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] relative overflow-hidden group transition-all duration-500 hover:border-white/20",
            `hover:shadow-[0_0_30px_rgba(var(--color-${stat.color}),0.1)]`
          )}>
            <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl -mr-12 -mt-12 opacity-20 group-hover:opacity-40 transition-opacity", `bg-${stat.color}`)} />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
            <p className="text-4xl font-black text-white mb-2 tracking-tight">{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Type Breakdown */}
        <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] h-[450px]">
          <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Content Type</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="45%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={8}
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={TYPE_COLORS[entry.name as keyof typeof TYPE_COLORS]} 
                    stroke="rgba(255,255,255,0.1)"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle"/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Breakdown (Pie Chart) */}
        <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] h-[450px]">
          <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Genre Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="45%"
                innerRadius={0}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {genreData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={GENRE_COLORS[index % GENRE_COLORS.length]} 
                    stroke="rgba(255,255,255,0.1)"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle"/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] h-[400px]">
          <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Platforms</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={10} fontWeight="bold" />
              <YAxis stroke="#71717a" fontSize={10} fontWeight="bold" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="value" fill="var(--color-neon-purple)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Funnel */}
        <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] h-[400px] flex flex-col items-center justify-center">
          <h3 className="text-lg font-black text-white mb-8 self-start uppercase tracking-widest">Watch Status</h3>
          <div className="w-full space-y-6">
            {['Completed', 'Watching', 'Want to Watch', 'Dropped'].map((status) => {
              const count = entries.filter(e => e.status === status).length;
              const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    <span>{status}</span>
                    <span>{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={cn(
                        "h-full rounded-full",
                        status === 'Completed' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
                        status === 'Watching' ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" :
                        status === 'Dropped' ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : 
                        "bg-zinc-500 shadow-[0_0_10px_rgba(113,113,122,0.5)]"
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
