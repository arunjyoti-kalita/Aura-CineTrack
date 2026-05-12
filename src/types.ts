export type EntertainmentType = 
  | 'Movie' 
  | 'Sitcom' 
  | 'Web Series' 
  | 'Short Film' 
  | 'Documentary' 
  | 'Anime' 
  | 'Mini-Series';

export type Status = 'Watching' | 'Completed' | 'Dropped' | 'Want to Watch';

export type Platform = 
  | 'Netflix' 
  | 'Prime' 
  | 'Disney+' 
  | 'Hotstar'
  | 'Apple TV+'
  | 'ZEE5'
  | 'JioCinema'
  | 'YouTube'
  | 'HBO' 
  | 'Theatre' 
  | 'Other';

export type Mood = 'Evening' | 'Daytime' | 'Weekend' | 'Anytime';

export type BasedOn = 'Original' | 'Book' | 'True Story' | 'Comic' | 'Game';

export interface WatchSession {
  date: string;
  rating: number; // 0-5 with 0.5 increments
  notes?: string;
}

export interface CustomList {
  id: string;
  name: string;
  description: string;
  entryIds: string[];
  createdAt: string;
  color: string;
}

export interface Entry {
  id: string;
  title: string;
  type: EntertainmentType;
  year: number;
  director: string;
  genre: string;
  subGenre?: string;
  nanoGenres?: string[];
  tags?: string[];
  leadActor: string;
  leadActress: string;
  supportingActor: string;
  platform: Platform;
  country: string;
  language: string;
  runtime: number; // minutes
  totalSeasons?: number;
  totalEpisodes?: number;
  episodesWatched: number;
  imdbRating: number;
  myRating: number; // 0-5 with 0.5 increments
  status: Status;
  startDate?: string;
  watchedDate?: string;
  watchHistory?: WatchSession[];
  rewatchable: boolean;
  mood: Mood;
  awardsWon?: string;
  oscarEmmyWins?: number;
  basedOn: BasedOn;
  franchise?: string;
  review: string;
  favEpisode?: string;
  favCharacter?: string;
  journalNotes?: string;
  journalMood?: '😂' | '😱' | '😢' | '🤯' | '🥰' | '⚡';
  recommend?: boolean;
  memorableQuote?: string;
  posterUrl: string;
  addedAt: string;
}

export interface Activity {
  id: string;
  type: 'log' | 'add' | 'streak' | 'badge' | 'list';
  message: string;
  timestamp: string;
  metadata?: {
    entryId?: string;
    rating?: number;
    badgeId?: string;
    listId?: string;
  };
}

export interface Goal {
  id: string;
  type: 'Movies' | 'Series' | 'Genres' | 'Country';
  target: number;
  current: number;
  manualOffset?: number;
  period: 'Weekly' | 'Monthly';
  notes?: string;
  createdAt: string;
  completedAt?: string;
  genre?: string;
  country?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  current: number;
  unlocked: boolean;
  color: string;
}
