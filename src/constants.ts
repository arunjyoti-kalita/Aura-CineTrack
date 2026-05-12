import { EntertainmentType } from './types';

export const TYPE_COLORS: Record<EntertainmentType, string> = {
  'Movie': '#3b82f6', // Blue
  'Web Series': '#22c55e', // Green
  'Sitcom': '#eab308', // Yellow
  'Anime': '#a855f7', // Purple
  'Documentary': '#f97316', // Orange
  'Short Film': '#ec4899', // Pink
  'Mini-Series': '#ef4444', // Red
};

export const TYPE_OPTIONS: EntertainmentType[] = [
  'Movie', 'Sitcom', 'Web Series', 'Short Film', 'Documentary', 'Anime', 'Mini-Series'
];

export const STATUS_OPTIONS = ['Watching', 'Completed', 'Dropped', 'Want to Watch'] as const;
export const PLATFORM_OPTIONS = [
  'Netflix', 
  'Prime', 
  'Disney+', 
  'Hotstar', 
  'Apple TV+', 
  'ZEE5', 
  'JioCinema', 
  'YouTube', 
  'HBO', 
  'Theatre', 
  'Other'
] as const;
export const MOOD_OPTIONS = ['Evening', 'Daytime', 'Weekend', 'Anytime'] as const;
export const BASED_ON_OPTIONS = ['Original', 'Book', 'True Story', 'Comic', 'Game'] as const;

export const NANO_GENRES = [
  'Existential road trip',
  'Unreliable narrator',
  'Found footage horror',
  'Slow burn thriller',
  'Feel good tearjerker',
  'Neo-noir detective',
  'Coming-of-age indie',
  'Satirical black comedy',
  'Dystopian cyberpunk',
  'Surrealist dreamscape',
  'Period piece drama',
  'High-stakes heist',
  'Space opera epic',
  'Gothic romance',
  'Mockumentary style'
];

export const POPULAR_TAGS = [
  'mindbending',
  'mustwatch',
  'overrated',
  'masterpiece',
  'rewatched',
  'underrated',
  'cinematography',
  'soundtrack',
  'acting',
  'plot-twist',
  'mindbending',
  'mustwatch',
  'comfort-movie',
  'rainy-day',
  'family-watch',
  'visual-masterpiece',
  'slow-burn',
  'feel-good',
  'dark-and-gritty',
  'whimsical',
  'nostalgic'
];

export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Crime', 'Crime Thriller', 'Drama', 'Fantasy', 'Horror', 'Mystery', 
  'Psychological', 'Romance', 'Sci-Fi', 'Thriller', 'Western', 
  'Animation', 'Biography', 'History', 'Musical', 'War'
];

export const NEON_GLOWS: Record<EntertainmentType, string> = {
  'Movie': 'neon-glow-blue',
  'Web Series': 'neon-glow-purple',
  'Sitcom': 'neon-glow-green',
  'Anime': 'neon-glow-pink',
  'Documentary': 'neon-glow-yellow',
  'Mini-Series': 'neon-glow-red',
  'Short Film': 'neon-glow-pink',
};

export const BADGE_DEFINITIONS = [
  { id: 'first-watch', title: 'First Watch', description: 'Watched your first movie', icon: '🎬', requirement: 1, color: 'blue' },
  { id: 'on-fire', title: 'On Fire', description: 'Watched 5 things in a row', icon: '🔥', requirement: 5, color: 'orange' },
  { id: 'world-cinema', title: 'World Cinema', description: 'Watched content from 3 different countries', icon: '🌍', requirement: 3, color: 'green' },
  { id: 'genre-hopper', title: 'Genre Hopper', description: 'Watched 5 different genres', icon: '🎭', requirement: 5, color: 'purple' },
  { id: 'critic-mode', title: 'Critic Mode', description: 'Rated 10 entries', icon: '⭐', requirement: 10, color: 'yellow' },
  { id: 'binge-master', title: 'Binge Master', description: 'Completed a full series', icon: '🍿', requirement: 1, color: 'pink' },
  { id: 'cinephile', title: 'Cinephile', description: 'Watched 30 movies', icon: '👑', requirement: 30, color: 'blue' },
];

export const MOOD_MAPPINGS = [
  { label: 'Laugh', emoji: '😂', genres: ['Comedy', 'Animation'] },
  { label: 'Scared', emoji: '😱', genres: ['Horror', 'Thriller'] },
  { label: 'Cry', emoji: '😢', genres: ['Drama', 'Romance'] },
  { label: 'Mind-blown', emoji: '🤯', genres: ['Sci-Fi', 'Mystery', 'Psychological'] },
  { label: 'Feel Good', emoji: '🥰', genres: ['Romance', 'Musical', 'Adventure'] },
  { label: 'Adrenaline', emoji: '⚡', genres: ['Action', 'Adventure', 'War'] },
];

export const POPULAR_COUNTRIES = [
  'India',
  'USA',
  'UK',
  'South Korea',
  'Japan',
  'France',
  'Spain',
  'Brazil',
  'Germany',
  'Italy',
  'Canada',
  'Australia',
  'China',
  'Mexico',
  'Iran',
  'Turkey',
  'Sweden',
  'Denmark',
  'Norway',
  'Russia'
].sort();

export const COUNTRY_NAME_MAPPINGS: Record<string, string> = {
  'USA': 'United States of America',
  'UNITED STATES': 'United States of America',
  'UNITED STATES OF AMERICA': 'United States of America',
  'US': 'United States of America',
  'UK': 'United Kingdom',
  'UNITED KINGDOM': 'United Kingdom',
  'UAE': 'United Arab Emirates',
  'SOUTH KOREA': 'South Korea',
  'KOREA': 'South Korea',
  'REPUBLIC OF KOREA': 'South Korea',
  'NORTH KOREA': 'North Korea',
  'RUSSIA': 'Russia',
  'RUSSIAN FEDERATION': 'Russia',
  'INDIA': 'India',
};

export const normalizeCountryName = (name: string) => {
  if (!name) return 'Unknown';
  const upper = name.trim().toUpperCase();
  return COUNTRY_NAME_MAPPINGS[upper] || name.trim();
};
