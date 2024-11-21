const TMDB_API_KEY = "0807408af560ef83d761f07fcac1dbee"; // Replace with your actual TMDB API key
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const recommendationsGrid = document.getElementById('recommendations-movie-grid');
const loadMoreButton = document.getElementById('load-more-button');

let currentPage = 1;
let totalPages = 1;
let baseMovieId = null;

// Function to get the first favorite movie ID or fallback to popular movies if none
async function getBaseFavoriteMovieId() {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/account/21614738/favorite/movies?api_key=${TMDB_API_KEY}&language=en-US&sort_by=created_at.asc&page=1`, {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDVkYTZmNjNmMTRhZTA3NzBkNzUzNmMxZjc1NzQ5NSIsIm5iZiI6MTczMTE5MTc3Mi4zMTQwNzcsInN1YiI6IjY3MmI5YzAyNDJiZWM0OTg3NzgwNzRjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2-4XFBYS13Kdgo5HJ_s_S_7PVt8oyNPQhjsSJYhbQYw'
            }
        });
        const data = await response.json();
        
        // If there are favorite movies, return the first favorite movie ID
        if (data.results && data.results.length > 0) {
            return data.results[0].id;
        }
        return null; // Return null if no favorites are found
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return null;
    }
}

// Fetch and display movie recommendations based on the base movie ID
async function fetchRecommendations(page = 1) {
    try {
        if (!baseMovieId) {
            baseMovieId = await getBaseFavoriteMovieId();
            if (!baseMovieId) {
                // Fallback to popular movies if no favorite movie is found
                fetchPopularMovies(page);
                return;
            }
        }

        const response = await fetch(`${TMDB_BASE_URL}/movie/${baseMovieId}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displayMovies(data.results);
            totalPages = data.total_pages;
            loadMoreButton.style.display = page < totalPages ? 'block' : 'none';
        } else {
            recommendationsGrid.innerHTML = "<p>No recommendations found for this movie.</p>";
            loadMoreButton.style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        recommendationsGrid.innerHTML = "<p>Failed to load recommendations.</p>";
        loadMoreButton.style.display = 'none';
    }
}

// Display movies in the recommendations grid
function displayMovies(movies) {
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h4>${movie.title}</h4>
            <p>Release Date: ${movie.release_date}</p>
        `;
        recommendationsGrid.appendChild(movieCard);
    });
}

// Fallback to fetch popular movies if no favorite recommendations are found
async function fetchPopularMovies(page = 1) {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displayMovies(data.results);
            totalPages = data.total_pages;
            loadMoreButton.style.display = page < totalPages ? 'block' : 'none';
        } else {
            recommendationsGrid.innerHTML = "<p>No movies available to recommend.</p>";
            loadMoreButton.style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        recommendationsGrid.innerHTML = "<p>Failed to load popular movies.</p>";
        loadMoreButton.style.display = 'none';
    }
}

// Load more recommendations when "Load More" button is clicked
function loadMoreRecommendations() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchRecommendations(currentPage);
    }
}

// Initialize recommendations on page load
async function initRecommendations() {
    baseMovieId = await getBaseFavoriteMovieId();
    fetchRecommendations(currentPage);
}

// Set up the "Load More" button event listener
loadMoreButton.addEventListener('click', loadMoreRecommendations);

// Start fetching recommendations on page load
document.addEventListener('DOMContentLoaded', initRecommendations);
