const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface TMDBSearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  vote_average: number;
}

export interface TMDBDetails {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  episode_run_time?: number[];
  genres: { id: number; name: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  credits: {
    cast: { name: string; character: string; order: number }[];
    crew: { name: string; job: string }[];
  };
  vote_average: number;
}

export async function searchTMDB(query: string): Promise<TMDBSearchResult[]> {
  if (!TMDB_API_KEY || TMDB_API_KEY === 'MY_TMDB_API_KEY') {
    console.warn('TMDB API Key is missing');
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('TMDB Search Error:', error);
    return [];
  }
}

export async function getTMDBDetails(id: number, type: 'movie' | 'tv'): Promise<TMDBDetails | null> {
  if (!TMDB_API_KEY || TMDB_API_KEY === 'MY_TMDB_API_KEY') return null;

  try {
    const response = await fetch(
      `${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('TMDB Details Error:', error);
    return null;
  }
}

export function getTMDBPosterUrl(path: string | null): string {
  if (!path) return '';
  return `${IMAGE_BASE_URL}${path}`;
}
