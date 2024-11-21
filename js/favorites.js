// const TMDB_API_KEY = "0807408af560ef83d761f07fcac1dbee";
const TMDB_API_KEY = "d45da6f63f14ae0770d7536c1f757495";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_ACCOUNT_ID = "21614738";

// Example function to fetch movie details (using a placeholder fetch)
async function fetchMovieDetails(movieId) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=0807408af560ef83d761f07fcac1dbee`);
  return await response.json();
}

// Display favorite movies
async function displayFavorites() {
  const grid = document.getElementById('favorites-movie-grid');
  grid.innerHTML = ''; // Clear existing content
  const TMDB_ACCOUNT_ID = "21614738";

  const response = await fetch(`https://api.themoviedb.org/3/account/${TMDB_ACCOUNT_ID}/favorite/movies`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDVkYTZmNjNmMTRhZTA3NzBkNzUzNmMxZjc1NzQ5NSIsIm5iZiI6MTczMTE5MTc3Mi4zMTQwNzcsInN1YiI6IjY3MmI5YzAyNDJiZWM0OTg3NzgwNzRjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2-4XFBYS13Kdgo5HJ_s_S_7PVt8oyNPQhjsSJYhbQYw'
    }
  });
  const data = await response.json();
  console.log(data.results);
  const favorites = [];
  data.results.forEach((fav)=>favorites.push(fav.id));
  console.log(favorites);
  if (favorites.length === 0) {
    grid.innerHTML = '<p>No favorites added yet!</p>';
    return;
  }

  for (const movieId of favorites) {
    const movie = await fetchMovieDetails(movieId);
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h4>${movie.title}</h4>
      <p>Release Date: ${movie.release_date}</p>
    `;
    grid.appendChild(movieCard);
  }
}

// Function to navigate to a section in index.html
function navigateToIndexSection(sectionId) {
  // Check if the current page is index.html
  if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
      // Scroll to the section within index.html if already there
      document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  } else {
      // Navigate to index.html and add the section ID to the URL
      window.location.href = `index.html#${sectionId}`;
  }
}

// Event listeners for the navigation links
document.querySelector("nav a[href='#search']").addEventListener("click", (e) => {
  e.preventDefault();
  navigateToIndexSection("search");
});

document.querySelector("nav a[href='#popular']").addEventListener("click", (e) => {
  e.preventDefault();
  navigateToIndexSection("popular");
});


// Load favorites on page load
document.addEventListener('DOMContentLoaded', displayFavorites);
