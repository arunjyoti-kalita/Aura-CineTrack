import type { Entry } from './types.ts';

export const SAMPLE_DATA: Entry[] = [
  // MOVIES (30)
  {
    id: 'm1', title: 'The Dark Knight', type: 'Movie', year: 2008, director: 'Christopher Nolan', genre: 'Action', subGenre: 'Crime',
    leadActor: 'Christian Bale', leadActress: 'Maggie Gyllenhaal', supportingActor: 'Heath Ledger', platform: 'HBO',
    country: 'USA', language: 'English', runtime: 152, episodesWatched: 1, imdbRating: 9.0, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 2, basedOn: 'Comic', franchise: 'Batman',
    review: 'The definitive superhero film with an iconic performance by Heath Ledger.',
    posterUrl: 'https://picsum.photos/seed/darkknight/400/600', addedAt: '2026-03-31T00:00:00Z'
  },
  {
    id: 'm2', title: 'Avengers: Endgame', type: 'Movie', year: 2019, director: 'Anthony & Joe Russo', genre: 'Action', subGenre: 'Sci-Fi',
    leadActor: 'Robert Downey Jr.', leadActress: 'Scarlett Johansson', supportingActor: 'Chris Evans', platform: 'Disney+',
    country: 'USA', language: 'English', runtime: 181, episodesWatched: 1, imdbRating: 8.4, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Weekend', oscarEmmyWins: 0, basedOn: 'Comic', franchise: 'MCU',
    review: 'An epic conclusion to a decade of storytelling.',
    posterUrl: 'https://picsum.photos/seed/endgame/400/600', addedAt: '2026-03-31T00:00:01Z'
  },
  {
    id: 'm3', title: 'Jurassic Park', type: 'Movie', year: 1993, director: 'Steven Spielberg', genre: 'Adventure', subGenre: 'Sci-Fi',
    leadActor: 'Sam Neill', leadActress: 'Laura Dern', supportingActor: 'Jeff Goldblum', platform: 'Prime',
    country: 'USA', language: 'English', runtime: 127, episodesWatched: 1, imdbRating: 8.2, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 3, basedOn: 'Book', franchise: 'Jurassic Park',
    review: 'A groundbreaking spectacle that still holds up today.',
    posterUrl: 'https://picsum.photos/seed/jurassic/400/600', addedAt: '2026-03-31T00:00:02Z'
  },
  {
    id: 'm4', title: 'Mad Max: Fury Road', type: 'Movie', year: 2015, director: 'George Miller', genre: 'Action', subGenre: 'Adventure',
    leadActor: 'Tom Hardy', leadActress: 'Charlize Theron', supportingActor: 'Nicholas Hoult', platform: 'HBO',
    country: 'Australia', language: 'English', runtime: 120, episodesWatched: 1, imdbRating: 8.1, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 6, basedOn: 'Original', franchise: 'Mad Max',
    review: 'A visual and technical masterpiece of pure action.',
    posterUrl: 'https://picsum.photos/seed/madmax/400/600', addedAt: '2026-03-31T00:00:03Z'
  },
  {
    id: 'm5', title: 'Die Hard', type: 'Movie', year: 1988, director: 'John McTiernan', genre: 'Action', subGenre: 'Thriller',
    leadActor: 'Bruce Willis', leadActress: 'Bonnie Bedelia', supportingActor: 'Alan Rickman', platform: 'Disney+',
    country: 'USA', language: 'English', runtime: 132, episodesWatched: 1, imdbRating: 8.2, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 0, basedOn: 'Book', franchise: 'Die Hard',
    review: 'The ultimate action movie and a Christmas classic.',
    posterUrl: 'https://picsum.photos/seed/diehard/400/600', addedAt: '2026-03-31T00:00:04Z'
  },
  {
    id: 'm6', title: 'Interstellar', type: 'Movie', year: 2014, director: 'Christopher Nolan', genre: 'Sci-Fi', subGenre: 'Drama',
    leadActor: 'Matthew McConaughey', leadActress: 'Anne Hathaway', supportingActor: 'Jessica Chastain', platform: 'Prime',
    country: 'USA', language: 'English', runtime: 169, episodesWatched: 1, imdbRating: 8.7, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 1, basedOn: 'Original', franchise: 'None',
    review: 'A visually stunning and emotionally resonant space epic.',
    posterUrl: 'https://picsum.photos/seed/interstellar/400/600', addedAt: '2026-03-31T00:00:05Z'
  },
  {
    id: 'm7', title: 'The Matrix', type: 'Movie', year: 1999, director: 'Lana & Lilly Wachowski', genre: 'Sci-Fi', subGenre: 'Action',
    leadActor: 'Keanu Reeves', leadActress: 'Carrie-Anne Moss', supportingActor: 'Laurence Fishburne', platform: 'HBO',
    country: 'USA', language: 'English', runtime: 136, episodesWatched: 1, imdbRating: 8.7, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 4, basedOn: 'Original', franchise: 'The Matrix',
    review: 'Redefined action cinema and sci-fi philosophy.',
    posterUrl: 'https://picsum.photos/seed/matrix/400/600', addedAt: '2026-03-31T00:00:06Z'
  },
  {
    id: 'm8', title: 'Inception', type: 'Movie', year: 2010, director: 'Christopher Nolan', genre: 'Sci-Fi', subGenre: 'Thriller',
    leadActor: 'Leonardo DiCaprio', leadActress: 'Marion Cotillard', supportingActor: 'Joseph Gordon-Levitt', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 148, episodesWatched: 1, imdbRating: 8.8, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 4, basedOn: 'Original', franchise: 'None',
    review: 'A complex, high-concept heist film that keeps you guessing.',
    posterUrl: 'https://picsum.photos/seed/inception/400/600', addedAt: '2026-03-31T00:00:07Z'
  },
  {
    id: 'm9', title: 'Avatar', type: 'Movie', year: 2009, director: 'James Cameron', genre: 'Sci-Fi', subGenre: 'Adventure',
    leadActor: 'Sam Worthington', leadActress: 'Zoe Saldana', supportingActor: 'Sigourney Weaver', platform: 'Disney+',
    country: 'USA', language: 'English', runtime: 162, episodesWatched: 1, imdbRating: 7.9, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Weekend', oscarEmmyWins: 3, basedOn: 'Original', franchise: 'Avatar',
    review: 'A technical marvel that brought 3D to the mainstream.',
    posterUrl: 'https://picsum.photos/seed/avatar/400/600', addedAt: '2026-03-31T00:00:08Z'
  },
  {
    id: 'm10', title: 'The Shawshank Redemption', type: 'Movie', year: 1994, director: 'Frank Darabont', genre: 'Drama', subGenre: 'Crime',
    leadActor: 'Tim Robbins', leadActress: 'N/A', supportingActor: 'Morgan Freeman', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 142, episodesWatched: 1, imdbRating: 9.3, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 0, basedOn: 'Book', franchise: 'None',
    review: 'A beautiful story of hope and friendship in the darkest of places.',
    posterUrl: 'https://picsum.photos/seed/shawshank/400/600', addedAt: '2026-03-31T00:00:09Z'
  },
  {
    id: 'm11', title: 'Forrest Gump', type: 'Movie', year: 1994, director: 'Robert Zemeckis', genre: 'Drama', subGenre: 'Romance',
    leadActor: 'Tom Hanks', leadActress: 'Robin Wright', supportingActor: 'Gary Sinise', platform: 'Prime',
    country: 'USA', language: 'English', runtime: 142, episodesWatched: 1, imdbRating: 8.8, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 6, basedOn: 'Book', franchise: 'None',
    review: 'A heartwarming journey through American history.',
    posterUrl: 'https://picsum.photos/seed/forrest/400/600', addedAt: '2026-03-31T00:00:10Z'
  },
  {
    id: 'm12', title: "Schindler's List", type: 'Movie', year: 1993, director: 'Steven Spielberg', genre: 'Drama', subGenre: 'History',
    leadActor: 'Liam Neeson', leadActress: 'N/A', supportingActor: 'Ben Kingsley', platform: 'HBO',
    country: 'USA', language: 'English', runtime: 195, episodesWatched: 1, imdbRating: 9.0, myRating: 0, status: 'Want to Watch',
    rewatchable: false, mood: 'Daytime', oscarEmmyWins: 7, basedOn: 'Book', franchise: 'None',
    review: 'A powerful and essential depiction of the Holocaust.',
    posterUrl: 'https://picsum.photos/seed/schindler/400/600', addedAt: '2026-03-31T00:00:11Z'
  },
  {
    id: 'm13', title: 'The Godfather', type: 'Movie', year: 1972, director: 'Francis Ford Coppola', genre: 'Crime', subGenre: 'Drama',
    leadActor: 'Marlon Brando', leadActress: 'Diane Keaton', supportingActor: 'Al Pacino', platform: 'Prime',
    country: 'USA', language: 'English', runtime: 175, episodesWatched: 1, imdbRating: 9.2, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 3, basedOn: 'Book', franchise: 'The Godfather',
    review: 'The ultimate crime epic and one of the greatest films ever made.',
    posterUrl: 'https://picsum.photos/seed/godfather/400/600', addedAt: '2026-03-31T00:00:12Z'
  },
  {
    id: 'm14', title: 'Parasite', type: 'Movie', year: 2019, director: 'Bong Joon-ho', genre: 'Thriller', subGenre: 'Drama',
    leadActor: 'Song Kang-ho', leadActress: 'Cho Yeo-jeong', supportingActor: 'Lee Sun-kyun', platform: 'Prime',
    country: 'South Korea', language: 'Korean', runtime: 132, episodesWatched: 1, imdbRating: 8.5, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 4, basedOn: 'Original', franchise: 'None',
    review: 'A masterclass in genre-blending and social commentary.',
    posterUrl: 'https://picsum.photos/seed/parasite/400/600', addedAt: '2026-03-31T00:00:13Z'
  },
  {
    id: 'm15', title: 'Get Out', type: 'Movie', year: 2017, director: 'Jordan Peele', genre: 'Horror', subGenre: 'Mystery',
    leadActor: 'Daniel Kaluuya', leadActress: 'Allison Williams', supportingActor: 'Bradley Whitford', platform: 'Prime',
    country: 'USA', language: 'English', runtime: 104, episodesWatched: 1, imdbRating: 7.8, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 1, basedOn: 'Original', franchise: 'None',
    review: 'A sharp, socially conscious horror film that redefined the genre.',
    posterUrl: 'https://picsum.photos/seed/getout/400/600', addedAt: '2026-03-31T00:00:14Z'
  },
  {
    id: 'm16', title: 'The Silence of the Lambs', type: 'Movie', year: 1991, director: 'Jonathan Demme', genre: 'Thriller', subGenre: 'Crime',
    leadActor: 'Anthony Hopkins', leadActress: 'Jodie Foster', supportingActor: 'Scott Glenn', platform: 'Prime',
    country: 'USA', language: 'English', runtime: 118, episodesWatched: 1, imdbRating: 8.6, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 5, basedOn: 'Book', franchise: 'Hannibal Lecter',
    review: 'A chilling and sophisticated psychological thriller.',
    posterUrl: 'https://picsum.photos/seed/silence/400/600', addedAt: '2026-03-31T00:00:15Z'
  },
  {
    id: 'm17', title: 'Psycho', type: 'Movie', year: 1960, director: 'Alfred Hitchcock', genre: 'Horror', subGenre: 'Mystery',
    leadActor: 'Anthony Perkins', leadActress: 'Janet Leigh', supportingActor: 'Vera Miles', platform: 'Other',
    country: 'USA', language: 'English', runtime: 109, episodesWatched: 1, imdbRating: 8.5, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 0, basedOn: 'Book', franchise: 'Psycho',
    review: 'The blueprint for the modern slasher film.',
    posterUrl: 'https://picsum.photos/seed/psycho/400/600', addedAt: '2026-03-31T00:00:16Z'
  },
  {
    id: 'm18', title: 'Home Alone', type: 'Movie', year: 1990, director: 'Chris Columbus', genre: 'Comedy', subGenre: 'Family',
    leadActor: 'Macaulay Culkin', leadActress: 'Catherine O\'Hara', supportingActor: 'Joe Pesci', platform: 'Disney+',
    country: 'USA', language: 'English', runtime: 103, episodesWatched: 1, imdbRating: 7.7, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 0, basedOn: 'Original', franchise: 'Home Alone',
    review: 'The ultimate childhood wish-fulfillment movie.',
    posterUrl: 'https://picsum.photos/seed/homealone/400/600', addedAt: '2026-03-31T00:00:17Z'
  },
  {
    id: 'm19', title: 'The Hangover', type: 'Movie', year: 2009, director: 'Todd Phillips', genre: 'Comedy', subGenre: 'Adventure',
    leadActor: 'Bradley Cooper', leadActress: 'Heather Graham', supportingActor: 'Zach Galifianakis', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 100, episodesWatched: 1, imdbRating: 7.7, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Weekend', oscarEmmyWins: 0, basedOn: 'Original', franchise: 'The Hangover',
    review: 'A hilarious and chaotic mystery comedy.',
    posterUrl: 'https://picsum.photos/seed/hangover/400/600', addedAt: '2026-03-31T00:00:18Z'
  },
  {
    id: 'm20', title: 'Superbad', type: 'Movie', year: 2007, director: 'Greg Mottola', genre: 'Comedy', subGenre: 'Coming of Age',
    leadActor: 'Jonah Hill', leadActress: 'Emma Stone', supportingActor: 'Michael Cera', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 113, episodesWatched: 1, imdbRating: 7.6, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Weekend', oscarEmmyWins: 0, basedOn: 'Original', franchise: 'None',
    review: 'One of the most relatable and funny teen comedies ever.',
    posterUrl: 'https://picsum.photos/seed/superbad/400/600', addedAt: '2026-03-31T00:00:19Z'
  },
  {
    id: 'm21', title: 'The Lion King', type: 'Movie', year: 1994, director: 'Roger Allers', genre: 'Animation', subGenre: 'Drama',
    leadActor: 'Matthew Broderick', leadActress: 'Moira Kelly', supportingActor: 'Jeremy Irons', platform: 'Disney+',
    country: 'USA', language: 'English', runtime: 88, episodesWatched: 1, imdbRating: 8.5, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 2, basedOn: 'Original', franchise: 'The Lion King',
    review: 'A timeless Disney classic with an incredible soundtrack.',
    posterUrl: 'https://picsum.photos/seed/lionking/400/600', addedAt: '2026-03-31T00:00:20Z'
  },
  {
    id: 'm22', title: 'Spirited Away', type: 'Movie', year: 2001, director: 'Hayao Miyazaki', genre: 'Animation', subGenre: 'Fantasy',
    leadActor: 'Rumi Hiiragi', leadActress: 'Mari Natsuki', supportingActor: 'Miyu Irino', platform: 'Netflix',
    country: 'Japan', language: 'Japanese', runtime: 125, episodesWatched: 1, imdbRating: 8.6, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 1, basedOn: 'Original', franchise: 'Studio Ghibli',
    review: 'A magical and imaginative journey into a spirit world.',
    posterUrl: 'https://picsum.photos/seed/spirited/400/600', addedAt: '2026-03-31T00:00:21Z'
  },
  {
    id: 'm23', title: 'Toy Story', type: 'Movie', year: 1995, director: 'John Lasseter', genre: 'Animation', subGenre: 'Adventure',
    leadActor: 'Tom Hanks', leadActress: 'Annie Potts', supportingActor: 'Tim Allen', platform: 'Disney+',
    country: 'USA', language: 'English', runtime: 81, episodesWatched: 1, imdbRating: 8.3, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 0, basedOn: 'Original', franchise: 'Toy Story',
    review: 'The film that started the CGI animation revolution.',
    posterUrl: 'https://picsum.photos/seed/toystory/400/600', addedAt: '2026-03-31T00:00:22Z'
  },
  {
    id: 'm24', title: 'Titanic', type: 'Movie', year: 1997, director: 'James Cameron', genre: 'Romance', subGenre: 'Drama',
    leadActor: 'Leonardo DiCaprio', leadActress: 'Kate Winslet', supportingActor: 'Billy Zane', platform: 'Disney+',
    country: 'USA', language: 'English', runtime: 194, episodesWatched: 1, imdbRating: 7.9, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 11, basedOn: 'True Story', franchise: 'None',
    review: 'An epic romance set against a historical tragedy.',
    posterUrl: 'https://picsum.photos/seed/titanic/400/600', addedAt: '2026-03-31T00:00:23Z'
  },
  {
    id: 'm25', title: 'La La Land', type: 'Movie', year: 2016, director: 'Damien Chazelle', genre: 'Musical', subGenre: 'Romance',
    leadActor: 'Ryan Gosling', leadActress: 'Emma Stone', supportingActor: 'John Legend', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 128, episodesWatched: 1, imdbRating: 8.0, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 6, basedOn: 'Original', franchise: 'None',
    review: 'A vibrant and bittersweet tribute to dreamers.',
    posterUrl: 'https://picsum.photos/seed/lalaland/400/600', addedAt: '2026-03-31T00:00:24Z'
  },
  {
    id: 'm26', title: 'Star Wars: A New Hope', type: 'Movie', year: 1977, director: 'George Lucas', genre: 'Sci-Fi', subGenre: 'Adventure',
    leadActor: 'Mark Hamill', leadActress: 'Carrie Fisher', supportingActor: 'Harrison Ford', platform: 'Disney+',
    country: 'USA', language: 'English', runtime: 121, episodesWatched: 1, imdbRating: 8.6, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 6, basedOn: 'Original', franchise: 'Star Wars',
    review: 'The film that launched a cultural phenomenon.',
    posterUrl: 'https://picsum.photos/seed/starwars/400/600', addedAt: '2026-03-31T00:00:25Z'
  },
  {
    id: 'm27', title: 'Harry Potter and the Sorcerer\'s Stone', type: 'Movie', year: 2001, director: 'Chris Columbus', genre: 'Fantasy', subGenre: 'Adventure',
    leadActor: 'Daniel Radcliffe', leadActress: 'Emma Watson', supportingActor: 'Rupert Grint', platform: 'Other',
    country: 'UK', language: 'English', runtime: 152, episodesWatched: 1, imdbRating: 7.6, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 0, basedOn: 'Book', franchise: 'Harry Potter',
    review: 'A magical introduction to the Wizarding World.',
    posterUrl: 'https://picsum.photos/seed/hp1/400/600', addedAt: '2026-03-31T00:00:26Z'
  },
  {
    id: 'm28', title: 'The Lord of the Rings: The Fellowship of the Ring', type: 'Movie', year: 2001, director: 'Peter Jackson', genre: 'Fantasy', subGenre: 'Adventure',
    leadActor: 'Elijah Wood', leadActress: 'Cate Blanchett', supportingActor: 'Ian McKellen', platform: 'Prime',
    country: 'New Zealand', language: 'English', runtime: 178, episodesWatched: 1, imdbRating: 8.9, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Weekend', oscarEmmyWins: 4, basedOn: 'Book', franchise: 'LOTR',
    review: 'The beginning of the greatest fantasy trilogy in cinema.',
    posterUrl: 'https://picsum.photos/seed/lotr1/400/600', addedAt: '2026-03-31T00:00:27Z'
  },
  {
    id: 'm29', title: 'Pulp Fiction', type: 'Movie', year: 1994, director: 'Quentin Tarantino', genre: 'Crime', subGenre: 'Drama',
    leadActor: 'John Travolta', leadActress: 'Uma Thurman', supportingActor: 'Samuel L. Jackson', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 154, episodesWatched: 1, imdbRating: 8.9, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 1, basedOn: 'Original', franchise: 'None',
    review: 'A stylish and influential masterpiece of non-linear storytelling.',
    posterUrl: 'https://picsum.photos/seed/pulpfiction/400/600', addedAt: '2026-03-31T00:00:28Z'
  },
  {
    id: 'm30', title: 'Oppenheimer', type: 'Movie', year: 2023, director: 'Christopher Nolan', genre: 'Biography', subGenre: 'Drama',
    leadActor: 'Cillian Murphy', leadActress: 'Emily Blunt', supportingActor: 'Robert Downey Jr.', platform: 'Theatre',
    country: 'USA', language: 'English', runtime: 180, episodesWatched: 1, imdbRating: 8.3, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 7, basedOn: 'Book', franchise: 'None',
    review: 'A haunting and brilliant portrayal of the father of the atomic bomb.',
    posterUrl: 'https://picsum.photos/seed/oppenheimer/400/600', addedAt: '2026-03-31T00:00:29Z'
  },

  // SITCOMS (5)
  {
    id: 's1', title: 'Friends', type: 'Sitcom', year: 1994, director: 'David Crane', genre: 'Comedy', subGenre: 'Romance',
    leadActor: 'Matthew Perry', leadActress: 'Jennifer Aniston', supportingActor: 'Matt LeBlanc', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 22, totalSeasons: 10, totalEpisodes: 236, episodesWatched: 0, imdbRating: 8.9, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 6, basedOn: 'Original', franchise: 'Friends',
    review: 'The ultimate ensemble sitcom about friendship and life in NYC.',
    posterUrl: 'https://picsum.photos/seed/friends/400/600', addedAt: '2026-03-31T00:00:30Z'
  },
  {
    id: 's2', title: 'The Office US', type: 'Sitcom', year: 2005, director: 'Greg Daniels', genre: 'Comedy', subGenre: 'Mockumentary',
    leadActor: 'Steve Carell', leadActress: 'Jenna Fischer', supportingActor: 'Rainn Wilson', platform: 'Prime',
    country: 'USA', language: 'English', runtime: 22, totalSeasons: 9, totalEpisodes: 201, episodesWatched: 0, imdbRating: 9.0, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 5, basedOn: 'Original', franchise: 'The Office',
    review: 'A hilarious and often touching look at office life.',
    posterUrl: 'https://picsum.photos/seed/theoffice/400/600', addedAt: '2026-03-31T00:00:31Z'
  },
  {
    id: 's3', title: 'Seinfeld', type: 'Sitcom', year: 1989, director: 'Larry David', genre: 'Comedy', subGenre: 'Satire',
    leadActor: 'Jerry Seinfeld', leadActress: 'Julia Louis-Dreyfus', supportingActor: 'Jason Alexander', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 22, totalSeasons: 9, totalEpisodes: 180, episodesWatched: 0, imdbRating: 8.9, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 10, basedOn: 'Original', franchise: 'Seinfeld',
    review: 'The "show about nothing" that changed sitcoms forever.',
    posterUrl: 'https://picsum.photos/seed/seinfeld/400/600', addedAt: '2026-03-31T00:00:32Z'
  },
  {
    id: 's4', title: 'How I Met Your Mother', type: 'Sitcom', year: 2005, director: 'Carter Bays', genre: 'Comedy', subGenre: 'Romance',
    leadActor: 'Josh Radnor', leadActress: 'Cobie Smulders', supportingActor: 'Neil Patrick Harris', platform: 'Disney+',
    country: 'USA', language: 'English', runtime: 22, totalSeasons: 9, totalEpisodes: 208, episodesWatched: 0, imdbRating: 8.3, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 9, basedOn: 'Original', franchise: 'HIMYM',
    review: 'A legen—wait for it—dary sitcom about the search for love.',
    posterUrl: 'https://picsum.photos/seed/himym/400/600', addedAt: '2026-03-31T00:00:33Z'
  },
  {
    id: 's5', title: 'Brooklyn Nine-Nine', type: 'Sitcom', year: 2013, director: 'Michael Schur', genre: 'Comedy', subGenre: 'Crime',
    leadActor: 'Andy Samberg', leadActress: 'Melissa Fumero', supportingActor: 'Andre Braugher', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 22, totalSeasons: 8, totalEpisodes: 153, episodesWatched: 0, imdbRating: 8.4, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 2, basedOn: 'Original', franchise: 'B99',
    review: 'A wholesome and hilarious police procedural comedy.',
    posterUrl: 'https://picsum.photos/seed/b99/400/600', addedAt: '2026-03-31T00:00:34Z'
  },

  // WEB SERIES (5)
  {
    id: 'w1', title: 'Breaking Bad', type: 'Web Series', year: 2008, director: 'Vince Gilligan', genre: 'Crime', subGenre: 'Drama',
    leadActor: 'Bryan Cranston', leadActress: 'Anna Gunn', supportingActor: 'Aaron Paul', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 47, totalSeasons: 5, totalEpisodes: 62, episodesWatched: 0, imdbRating: 9.5, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 16, basedOn: 'Original', franchise: 'Breaking Bad',
    review: 'The transformation of Walter White is one of TV\'s greatest achievements.',
    posterUrl: 'https://picsum.photos/seed/breakingbad/400/600', addedAt: '2026-03-31T00:00:35Z'
  },
  {
    id: 'w2', title: 'Game of Thrones', type: 'Web Series', year: 2011, director: 'David Benioff', genre: 'Fantasy', subGenre: 'Drama',
    leadActor: 'Kit Harington', leadActress: 'Emilia Clarke', supportingActor: 'Peter Dinklage', platform: 'HBO',
    country: 'USA', language: 'English', runtime: 57, totalSeasons: 8, totalEpisodes: 73, episodesWatched: 0, imdbRating: 9.2, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Weekend', oscarEmmyWins: 59, basedOn: 'Book', franchise: 'Game of Thrones',
    review: 'An epic fantasy saga of power, betrayal, and dragons.',
    posterUrl: 'https://picsum.photos/seed/got/400/600', addedAt: '2026-03-31T00:00:36Z'
  },
  {
    id: 'w3', title: 'Stranger Things', type: 'Web Series', year: 2016, director: 'The Duffer Brothers', genre: 'Sci-Fi', subGenre: 'Horror',
    leadActor: 'Finn Wolfhard', leadActress: 'Millie Bobby Brown', supportingActor: 'David Harbour', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 51, totalSeasons: 4, totalEpisodes: 34, episodesWatched: 0, imdbRating: 8.7, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Weekend', oscarEmmyWins: 7, basedOn: 'Original', franchise: 'Stranger Things',
    review: '80s nostalgia meets supernatural mystery.',
    posterUrl: 'https://picsum.photos/seed/strangerthings/400/600', addedAt: '2026-03-31T00:00:37Z'
  },
  {
    id: 'w4', title: 'The Crown', type: 'Web Series', year: 2016, director: 'Peter Morgan', genre: 'Drama', subGenre: 'History',
    leadActor: 'Claire Foy', leadActress: 'Olivia Colman', supportingActor: 'Matt Smith', platform: 'Netflix',
    country: 'UK', language: 'English', runtime: 58, totalSeasons: 6, totalEpisodes: 60, episodesWatched: 0, imdbRating: 8.6, myRating: 0, status: 'Want to Watch',
    rewatchable: false, mood: 'Evening', oscarEmmyWins: 21, basedOn: 'True Story', franchise: 'None',
    review: 'A lavish and insightful look at the reign of Queen Elizabeth II.',
    posterUrl: 'https://picsum.photos/seed/thecrown/400/600', addedAt: '2026-03-31T00:00:38Z'
  },
  {
    id: 'w5', title: 'Squid Game', type: 'Web Series', year: 2021, director: 'Hwang Dong-hyuk', genre: 'Thriller', subGenre: 'Drama',
    leadActor: 'Lee Jung-jae', leadActress: 'Jung Ho-yeon', supportingActor: 'Park Hae-soo', platform: 'Netflix',
    country: 'South Korea', language: 'Korean', runtime: 55, totalSeasons: 1, totalEpisodes: 9, episodesWatched: 0, imdbRating: 8.0, myRating: 0, status: 'Want to Watch',
    rewatchable: false, mood: 'Evening', oscarEmmyWins: 6, basedOn: 'Original', franchise: 'Squid Game',
    review: 'A brutal and gripping social commentary disguised as a survival game.',
    posterUrl: 'https://picsum.photos/seed/squidgame/400/600', addedAt: '2026-03-31T00:00:39Z'
  },

  // ANIME (3)
  {
    id: 'a1', title: 'Death Note', type: 'Anime', year: 2006, director: 'Tetsurō Araki', genre: 'Mystery', subGenre: 'Psychological',
    leadActor: 'Mamoru Miyano', leadActress: 'Aya Hirano', supportingActor: 'Kappei Yamaguchi', platform: 'Netflix',
    country: 'Japan', language: 'Japanese', runtime: 23, totalSeasons: 1, totalEpisodes: 37, episodesWatched: 0, imdbRating: 8.9, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Evening', oscarEmmyWins: 0, basedOn: 'Comic', franchise: 'Death Note',
    review: 'A brilliant cat-and-mouse game between two geniuses.',
    posterUrl: 'https://picsum.photos/seed/deathnote/400/600', addedAt: '2026-03-31T00:00:40Z'
  },
  {
    id: 'a2', title: 'Attack on Titan', type: 'Anime', year: 2013, director: 'Tetsurō Araki', genre: 'Action', subGenre: 'Dark Fantasy',
    leadActor: 'Yuki Kaji', leadActress: 'Yui Ishikawa', supportingActor: 'Hiroshi Kamiya', platform: 'Prime',
    country: 'Japan', language: 'Japanese', runtime: 24, totalSeasons: 4, totalEpisodes: 88, episodesWatched: 0, imdbRating: 9.1, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 0, basedOn: 'Comic', franchise: 'AoT',
    review: 'An epic story of survival and freedom with incredible twists.',
    posterUrl: 'https://picsum.photos/seed/aot/400/600', addedAt: '2026-03-31T00:00:41Z'
  },
  {
    id: 'a3', title: 'Fullmetal Alchemist: Brotherhood', type: 'Anime', year: 2009, director: 'Yasuhiro Irie', genre: 'Adventure', subGenre: 'Fantasy',
    leadActor: 'Romi Park', leadActress: 'Rie Kugimiya', supportingActor: 'Shin-ichiro Miki', platform: 'Netflix',
    country: 'Japan', language: 'Japanese', runtime: 24, totalSeasons: 1, totalEpisodes: 64, episodesWatched: 0, imdbRating: 9.1, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Anytime', oscarEmmyWins: 0, basedOn: 'Comic', franchise: 'FMA',
    review: 'A perfectly paced and emotionally powerful journey of two brothers.',
    posterUrl: 'https://picsum.photos/seed/fmab/400/600', addedAt: '2026-03-31T00:00:42Z'
  },

  // DOCUMENTARIES (3)
  {
    id: 'd1', title: 'Making a Murderer', type: 'Documentary', year: 2015, director: 'Laura Ricciardi', genre: 'Crime', subGenre: 'Social Issues',
    leadActor: 'N/A', leadActress: 'N/A', supportingActor: 'N/A', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 60, totalSeasons: 2, totalEpisodes: 20, episodesWatched: 0, imdbRating: 8.6, myRating: 0, status: 'Want to Watch',
    rewatchable: false, mood: 'Daytime', oscarEmmyWins: 4, basedOn: 'True Story', franchise: 'None',
    review: 'A shocking and controversial look at the justice system.',
    posterUrl: 'https://picsum.photos/seed/makingamurderer/400/600', addedAt: '2026-03-31T00:00:43Z'
  },
  {
    id: 'd2', title: 'The Last Dance', type: 'Documentary', year: 2020, director: 'Jason Hehir', genre: 'Biography', subGenre: 'Sports',
    leadActor: 'Michael Jordan', leadActress: 'N/A', supportingActor: 'Scottie Pippen', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 50, totalSeasons: 1, totalEpisodes: 10, episodesWatched: 0, imdbRating: 9.1, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Weekend', oscarEmmyWins: 1, basedOn: 'True Story', franchise: 'None',
    review: 'A definitive look at the career of Michael Jordan and the 90s Bulls.',
    posterUrl: 'https://picsum.photos/seed/lastdance/400/600', addedAt: '2026-03-31T00:00:44Z'
  },
  {
    id: 'd3', title: '13th', type: 'Documentary', year: 2016, director: 'Ava DuVernay', genre: 'History', subGenre: 'Social Issues',
    leadActor: 'N/A', leadActress: 'N/A', supportingActor: 'N/A', platform: 'Netflix',
    country: 'USA', language: 'English', runtime: 100, episodesWatched: 0, imdbRating: 8.2, myRating: 0, status: 'Want to Watch',
    rewatchable: false, mood: 'Daytime', oscarEmmyWins: 1, basedOn: 'True Story', franchise: 'None',
    review: 'An essential examination of the US prison system and racial inequality.',
    posterUrl: 'https://picsum.photos/seed/13th/400/600', addedAt: '2026-03-31T00:00:45Z'
  },

  // MINI-SERIES (2)
  {
    id: 'ms1', title: 'Chernobyl', type: 'Mini-Series', year: 2019, director: 'Johan Renck', genre: 'Drama', subGenre: 'History',
    leadActor: 'Jared Harris', leadActress: 'Emily Watson', supportingActor: 'Stellan Skarsgård', platform: 'HBO',
    country: 'USA', language: 'English', runtime: 60, totalSeasons: 1, totalEpisodes: 5, episodesWatched: 0, imdbRating: 9.4, myRating: 0, status: 'Want to Watch',
    rewatchable: false, mood: 'Evening', oscarEmmyWins: 10, basedOn: 'True Story', franchise: 'None',
    review: 'A harrowing and brilliant depiction of the 1986 nuclear disaster.',
    posterUrl: 'https://picsum.photos/seed/chernobyl/400/600', addedAt: '2026-03-31T00:00:46Z'
  },
  {
    id: 'ms2', title: 'Band of Brothers', type: 'Mini-Series', year: 2001, director: 'Phil Alden Robinson', genre: 'War', subGenre: 'Drama',
    leadActor: 'Damian Lewis', leadActress: 'N/A', supportingActor: 'Ron Livingston', platform: 'HBO',
    country: 'USA', language: 'English', runtime: 60, totalSeasons: 1, totalEpisodes: 10, episodesWatched: 0, imdbRating: 9.4, myRating: 0, status: 'Want to Watch',
    rewatchable: true, mood: 'Weekend', oscarEmmyWins: 6, basedOn: 'Book', franchise: 'None',
    review: 'The gold standard for WWII storytelling on television.',
    posterUrl: 'https://picsum.photos/seed/bandofbrothers/400/600', addedAt: '2026-03-31T00:00:47Z'
  }
];
