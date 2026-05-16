/**
 * Levenshtein distance algorithm for fuzzy matching.
 * Calculates the minimum number of single-character edits required to change one word into the other.
 */
export function getLevenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}

/**
 * Calculates a similarity score between 0 and 1.
 * 1 means exact match, 0 means no similarity.
 */
export function getSimilarity(s1: string, s2: string): number {
  const str1 = s1.toLowerCase();
  const str2 = s2.toLowerCase();
  
  if (str1 === str2) return 1;
  if (str2.includes(str1)) return 0.8 + (str1.length / str2.length) * 0.2;
  
  const distance = getLevenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - distance / maxLength;
}

/**
 * Prefix Index for fast autocompletion.
 * Maps prefixes to arrays of matching titles.
 */
export class PrefixIndex {
  private index: Map<string, string[]> = new Map();

  constructor(titles: string[]) {
    titles.forEach(title => {
      if (!title || typeof title !== 'string') return;
      const words = title.toLowerCase().split(/\s+/);
      words.forEach(word => {
        // Index every prefix up to 5 characters
        for (let i = 1; i <= Math.min(word.length, 5); i++) {
          const prefix = word.substring(0, i);
          const existing = this.index.get(prefix) || [];
          if (!existing.includes(title)) {
            this.index.set(prefix, [...existing, title]);
          }
        }
      });
      
      // Also index the start of the full title
      for (let i = 1; i <= Math.min(title.length, 10); i++) {
        const prefix = title.toLowerCase().substring(0, i);
        const existing = this.index.get(prefix) || [];
        if (!existing.includes(title)) {
          this.index.set(prefix, [...existing, title]);
        }
      }
    });
  }

  search(query: string): string[] {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return [];
    
    // Direct prefix match
    const matches = this.index.get(cleanQuery) || [];
    
    // If few matches, try fuzzy matching against the whole index keys (or a subset)
    if (matches.length < 5) {
      // This is a simple fuzzy search for demonstration
      // In a real app, you might want to use a more optimized approach
    }
    
    return matches.sort((a, b) => {
      // Prioritize matches that start with the query
      const aStarts = a.toLowerCase().startsWith(cleanQuery);
      const bStarts = b.toLowerCase().startsWith(cleanQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.length - b.length;
    });
  }
}

/**
 * Fuzzy search across a list of objects.
 */
export function fuzzySearch<T>(
  items: T[],
  query: string,
  keySelector: (item: T) => string,
  threshold = 0.4
): T[] {
  if (!query) return items;
  
  const scores = items.map(item => {
    const key = keySelector(item);
    return {
      item,
      score: getSimilarity(query, key)
    };
  });
  
  return scores
    .filter(s => s.score > threshold)
    .sort((a, b) => b.score - a.score)
    .map(s => s.item);
}
