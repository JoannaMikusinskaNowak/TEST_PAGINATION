const galleryOfMovies = document.querySelector('.movie-gallery');

const API_KEY = '50faffa66bb05e881b7f3de0b265b30c';
const BASE_URL = 'https://api.themoviedb.org/3';
const MAIN_PAGE_PATH = '/trending/all/day';
const GENRE_LIST_PATH = `/genre/movie/list`;

let page = 1;

async function fetchMovies(page) {
  const response = await fetch(`${BASE_URL}${MAIN_PAGE_PATH}?api_key=${API_KEY}&page=${page}`);
  const fetchMovies = await response.json();
  console.log(fetchMovies.results);
  return fetchMovies.results;
}

async function renderMoviesCards(movies) {
  const genres = await fetchGenres();

  const markup = movies
    .map(({ poster_path, title, name, genre_ids, release_date, first_air_date }) => {
      const movieGenres = genre_ids
        .map(genreId => {
          const genre = genres.find(genre => genre.id === genreId);
          return genre ? genre.name : null;
        })
        .filter(genreName => genreName)
        .join(', ');

      const releaseDate = (release_date || first_air_date || 'Brak danych').slice(0, 4);
      const movieTitle = title ? title : name;
      return `
          <li class="movie-card">
            <img class="movie-card__img" src="https://image.tmdb.org/t/p/w500${poster_path}" loading="lazy" alt="${movieTitle}" />
            <h2>${movieTitle}</h2>
            <p>${movieGenres}</p>
            <p>${releaseDate}</p>
          </li>
        `;
    })
    .join('');

  return galleryOfMovies.insertAdjacentHTML('beforeend', markup);
}

async function fetchGenres() {
  const response = await fetch(`${BASE_URL}/${GENRE_LIST_PATH}?api_key=${API_KEY}`);
  const data = await response.json();
  return data.genres;
}

fetchMovies(page)
  .then(renderMoviesCards)
  .catch(error => console.error(error));

export { fetchMovies, renderMoviesCards, fetchGenres };