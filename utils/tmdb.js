const API_TOKEN = 'Bearer YOUR_READ_ACCESS_TOKEN';

export const searchMovies = async (query) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: API_TOKEN,
        'Content-Type': 'application/json',
      },
    }
  );
  return (await res.json()).results;
};
