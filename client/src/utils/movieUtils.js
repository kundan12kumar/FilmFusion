const TMDB_IMAGE_BASE_URL = process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-movie.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (posterPath) => getImageUrl(posterPath, 'w500');
export const getBackdropUrl = (backdropPath) => getImageUrl(backdropPath, 'w1280');
export const getThumbnailUrl = (posterPath) => getImageUrl(posterPath, 'w300');

export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatYear = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).getFullYear();
};

export const formatRuntime = (minutes) => {
  if (!minutes) return 'Unknown';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatRating = (rating) => {
  if (!rating) return '0.0';
  return Number(rating).toFixed(1);
};

export const getGenreNames = (genreIds, genreList) => {
  if (!genreIds || !genreList) return [];
  return genreIds.map(id => {
    const genre = genreList.find(g => g.id === id);
    return genre ? genre.name : null;
  }).filter(Boolean);
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const getMovieUrl = (movieId, title) => {
  const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '';
  return `/movie/${movieId}${slug ? `-${slug}` : ''}`;
};

export const searchMovies = (movies, query) => {
  if (!query) return movies;
  const searchTerm = query.toLowerCase();
  return movies.filter(movie => 
    movie.title?.toLowerCase().includes(searchTerm) ||
    movie.overview?.toLowerCase().includes(searchTerm)
  );
};

export const sortMovies = (movies, sortBy) => {
  const sorted = [...movies];
  
  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'release_date':
      return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    case 'vote_average':
      return sorted.sort((a, b) => b.vote_average - a.vote_average);
    case 'popularity':
      return sorted.sort((a, b) => b.popularity - a.popularity);
    default:
      return sorted;
  }
};
