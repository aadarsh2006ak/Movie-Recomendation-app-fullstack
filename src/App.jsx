import { useState, useEffect } from "react";
import "./App.css";
import SearchIcon from "./search.svg";
import MovieCard from "./movieCard";

// =============================================
// BACKEND API CONFIGURATION
// =============================================
// Our Node.js backend runs on localhost:5000
const API_URL = "https://www.omdbapi.com/?apikey=bd5f4ae1";
const BACKEND_URL = "http://localhost:5000/api/movies";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ---------- NEW STATE VARIABLES ----------
  const [savedMovies, setSavedMovies] = useState([]);        // Movies saved in MongoDB
  const [recommendedMovie, setRecommendedMovie] = useState(null); // Random recommendation
  const [popularMovies, setPopularMovies] = useState([]);    // Top 5 popular movies
  const [showSaved, setShowSaved] = useState(false);         // Toggle view: search vs saved
  const [message, setMessage] = useState("");                // Success/error messages

  // =============================================
  // 1. SEARCH MOVIES FROM OMDB API
  // =============================================
  const searchMovie = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search || []);
  };

  // =============================================
  // 2. GET ALL SAVED MOVIES FROM MONGODB
  // =============================================
  const fetchSavedMovies = async () => {
    try {
      const response = await fetch(BACKEND_URL);
      const result = await response.json();
      if (result.success) {
        setSavedMovies(result.data);
      }
    } catch (error) {
      console.log("Backend not running yet. Start the server!");
    }
  };

  // =============================================
  // 3. SAVE A MOVIE TO MONGODB
  // =============================================
  const saveMovieToDB = async (movie) => {
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Type: movie.Type,
          Poster: movie.Poster,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setMessage(`✅ "${movie.Title}" saved!`);
        fetchSavedMovies(); // Refresh saved movies list
        getRecommendation(); // Get a new recommendation
        getPopularMovies();  // Refresh popular list
      }
    } catch (error) {
      setMessage("❌ Could not save movie. Is backend running?");
    }
  };

  // =============================================
  // 4. DELETE A MOVIE FROM MONGODB
  // =============================================
  const deleteMovieFromDB = async (imdbID, title) => {
    try {
      const response = await fetch(`${BACKEND_URL}/${imdbID}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setMessage(`🗑️ "${title}" removed!`);
        fetchSavedMovies();
        getRecommendation();
        getPopularMovies();
      }
    } catch (error) {
      setMessage("❌ Could not delete movie.");
    }
  };

  // =============================================
  // 5. GET RANDOM MOVIE RECOMMENDATION
  // =============================================
  const getRecommendation = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/recommend`);
      const result = await response.json();
      if (result.success && result.data) {
        setRecommendedMovie(result.data);
      }
    } catch (error) {
      console.log("Could not fetch recommendation");
    }
  };

  // =============================================
  // 6. GET TOP 5 POPULAR MOVIES
  // =============================================
  const getPopularMovies = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/popular`);
      const result = await response.json();
      if (result.success) {
        setPopularMovies(result.data);
      }
    } catch (error) {
      console.log("Could not fetch popular movies");
    }
  };

  // =============================================
  // 7. RATE A MOVIE (1-5 STARS)
  // =============================================
  const rateMovie = async (imdbID, rating) => {
    try {
      const response = await fetch(`${BACKEND_URL}/${imdbID}/rate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      const result = await response.json();
      if (result.success) {
        setMessage(`⭐ Rated! Average: ${result.data.rating}`);
        fetchSavedMovies();
        getPopularMovies();
      }
    } catch (error) {
      setMessage("❌ Could not rate movie.");
    }
  };

  // =============================================
  // 8. CHECK IF A MOVIE IS SAVED (for button toggle)
  // =============================================
  const isMovieSaved = (imdbID) => {
    return savedMovies.some((movie) => movie.imdbID === imdbID);
  };

  // =============================================
  // LOAD DATA ON APP START
  // =============================================
  useEffect(() => {
    searchMovie("Batman");
    fetchSavedMovies();
    getRecommendation();
    getPopularMovies();
  }, []);

  // =============================================
  // RENDER UI
  // =============================================
  return (
    <div className="app">
      {/* -------- TITLE -------- */}
      <h1>MovieSpace</h1>

      {/* -------- SAVED COUNT & TOGGLE BUTTON -------- */}
      <div className="top-bar">
        <button
          className={`toggle-btn ${!showSaved ? "active" : ""}`}
          onClick={() => setShowSaved(false)}
        >
          🔍 Search Movies
        </button>
        <button
          className={`toggle-btn ${showSaved ? "active" : ""}`}
          onClick={() => setShowSaved(true)}
        >
          💾 Saved ({savedMovies.length})
        </button>
      </div>

      {/* -------- MESSAGE NOTIFICATION -------- */}
      {message && (
        <div className="message" onClick={() => setMessage("")}>
          {message} ✖
        </div>
      )}

      {/* -------- MODE 1: SEARCH MOVIES -------- */}
      {!showSaved ? (
        <>
          {/* Search Bar */}
          <div className="search">
            <input
              placeholder="Search for movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchMovie(searchTerm);
                }
              }}
            />
            <img
              src={SearchIcon}
              alt="search"
              onClick={() => searchMovie(searchTerm)}
            />
          </div>

          {/* Recommendation Section */}
          {recommendedMovie && (
            <div className="recommendation-banner">
              <h2>🎯 Today's Recommendation</h2>
              <div className="recommendation-card">
                <img
                  src={
                    recommendedMovie.Poster !== "N/A"
                      ? recommendedMovie.Poster
                      : "https://via.placeholder.com/100x150"
                  }
                  alt={recommendedMovie.Title}
                />
                <div>
                  <h3>{recommendedMovie.Title}</h3>
                  <p>{recommendedMovie.Year} • {recommendedMovie.Type}</p>
                  <p>⭐ {recommendedMovie.rating || "Not rated yet"}</p>
                  <button
                    className="save-btn"
                    onClick={() => saveMovieToDB(recommendedMovie)}
                  >
                    👍 Save & Like
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Popular Movies Section */}
          {popularMovies.length > 0 && (
            <div className="popular-section">
              <h2>🔥 Most Popular</h2>
              <div className="popular-list">
                {popularMovies.map((movie, index) => (
                  <div key={movie.imdbID} className="popular-item">
                    <span className="rank">#{index + 1}</span>
                    <span>{movie.Title}</span>
                    <span className="popularity">Saved {movie.popularity}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Movie Search Results */}
          {movies?.length > 0 ? (
            <div className="container">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  isSaved={isMovieSaved(movie.imdbID)}
                  onSave={saveMovieToDB}
                  onDelete={deleteMovieFromDB}
                  onRate={rateMovie}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2>No Movies Found</h2>
            </div>
          )}
        </>
      ) : (
        /* -------- MODE 2: SAVED MOVIES -------- */
        <>
          <h2 className="section-title">💾 My Saved Movies ({savedMovies.length})</h2>
          {savedMovies.length > 0 ? (
            <div className="container">
              {savedMovies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  isSaved={true}
                  onSave={saveMovieToDB}
                  onDelete={deleteMovieFromDB}
                  onRate={rateMovie}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2>No saved movies yet. Search and save some! 🎬</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

