const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

export interface OMDBSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface OMDBDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
  Type: string;
}

export async function searchOMDB(query: string): Promise<OMDBSearchResult[]> {
  if (!OMDB_API_KEY || OMDB_API_KEY === 'your_omdb_api_key_here') {
    return [];
  }

  try {
    const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`);
    const data = await response.json();
    return data.Search || [];
  } catch (error) {
    console.error('OMDb Search Error:', error);
    return [];
  }
}

export async function getOMDBDetails(imdbID: string): Promise<OMDBDetails | null> {
  if (!OMDB_API_KEY || OMDB_API_KEY === 'your_omdb_api_key_here') return null;

  try {
    const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${OMDB_API_KEY}`);
    const data = await response.json();
    if (data.Response === 'False') return null;
    return data;
  } catch (error) {
    console.error('OMDb Details Error:', error);
    return null;
  }
}
