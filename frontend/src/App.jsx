import { useState, useEffect, useMemo } from "react";
import "./App.css";
import Navbar, { TABS } from "./components/Navbar";
import HeroSpotlight from "./components/HeroSpotlight";
import AiVibeRecommender from "./components/AiVibeRecommender";
import MoodGenreExplorer from "./components/MoodGenreExplorer";
import SpinTheReel from "./components/SpinTheReel";
import CinemaVault from "./components/CinemaVault";
import CinephileStats from "./components/CinephileStats";
import MovieDetailModal from "./components/MovieDetailModal";
import TrailerModal from "./components/TrailerModal";
import MovieCard from "./movieCard";
import { seedMoviesList } from "./data/seedMovies";

// =============================================
// SECURED CONFIGURATION VIA ENVIRONMENT VARIABLES
// =============================================
const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY || "bd5f4ae1";
const OMDB_BASE = import.meta.env.VITE_OMDB_API_URL || "https://www.omdbapi.com/";
const OMDB_API_URL = `${OMDB_BASE}?apikey=${OMDB_KEY}`;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/movies";
const LOCAL_STORAGE_KEY = "cineverse_saved_movies";

function App() {
  // Navigation & Views
  const [activeTab, setActiveTab] = useState(TABS.EXPLORE);

  // Data State
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedMovies, setSavedMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Modals & Media
  const [detailMovie, setDetailMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast Notification Helper
  const addToast = (text) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // ----------------------------------------------------
  // Load Saved Movies (MongoDB with LocalStorage fallback)
  // ----------------------------------------------------
  const fetchSavedMovies = async () => {
    try {
      const response = await fetch(BACKEND_URL);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setSavedMovies(result.data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result.data));
        return;
      }
    } catch (err) {
      console.log("Backend offline, using local storage cache");
    }

    // Local Storage Fallback
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        setSavedMovies(JSON.parse(cached));
      } catch (e) {
        setSavedMovies([]);
      }
    } else {
      // Seed default initial watchlist
      const initialFavs = seedMoviesList.slice(0, 3).map((m) => ({
        ...m,
        userStatus: "favorite",
        userRating: 9,
      }));
      setSavedMovies(initialFavs);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialFavs));
    }
  };

  // ----------------------------------------------------
  // Enrich Movie with Full Plot / Details from OMDB
  // ----------------------------------------------------
  const fetchFullMovieDetails = async (imdbID) => {
    try {
      const res = await fetch(`${OMDB_API_URL}&i=${imdbID}&plot=full`);
      const data = await res.json();
      if (data && data.Response === "True") {
        return data;
      }
    } catch (e) {
      console.log("OMDB detail fetch error:", e);
    }
    return null;
  };

  // ----------------------------------------------------
  // Search Movies via OMDB API
  // ----------------------------------------------------
  const handleSearch = async (title) => {
    const q = (title || searchTerm).trim();
    if (!q) return;

    setIsSearching(true);
    try {
      const response = await fetch(`${OMDB_API_URL}&s=${encodeURIComponent(q)}`);
      const data = await response.json();
      if (data && data.Search) {
        setSearchResults(data.Search);
      } else {
        // Fallback search locally in seed dataset
        const localMatches = seedMoviesList.filter((m) =>
          m.Title.toLowerCase().includes(q.toLowerCase())
        );
        setSearchResults(localMatches);
      }
    } catch (error) {
      const localMatches = seedMoviesList.filter((m) =>
        m.Title.toLowerCase().includes(q.toLowerCase())
      );
      setSearchResults(localMatches);
    } finally {
      setIsSearching(false);
    }
  };

  // ----------------------------------------------------
  // Save / Upsert Movie to Vault
  // ----------------------------------------------------
  const handleSaveMovie = async (movie, preferredStatus = "favorite") => {
    let completeData = { ...movie };

    // If movie lacks plot or genre, enrich from OMDB
    if (!completeData.Plot || completeData.Plot === "N/A" || !completeData.Genre) {
      const full = await fetchFullMovieDetails(movie.imdbID);
      if (full) {
        completeData = { ...completeData, ...full };
      }
    }

    completeData.userStatus = preferredStatus;
    if (!completeData.userRating) completeData.userRating = 0;

    // Optimistic UI update
    const updatedList = [
      completeData,
      ...savedMovies.filter((m) => m.imdbID !== movie.imdbID),
    ];
    setSavedMovies(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    addToast(`💖 "${movie.Title}" added to Cinema Vault!`);

    // Backend sync
    try {
      await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeData),
      });
    } catch (e) {
      console.log("Backend sync saved to local storage");
    }
  };

  // ----------------------------------------------------
  // Delete Movie from Vault
  // ----------------------------------------------------
  const handleDeleteMovie = async (imdbID, title) => {
    const updated = savedMovies.filter((m) => m.imdbID !== imdbID);
    setSavedMovies(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    addToast(`🗑️ "${title || 'Movie'}" removed from Vault`);

    try {
      await fetch(`${BACKEND_URL}/${imdbID}`, { method: "DELETE" });
    } catch (e) {
      console.log("Backend delete offline fallback");
    }
  };

  // ----------------------------------------------------
  // Update Review & Star Rating
  // ----------------------------------------------------
  const handleUpdateReview = async (imdbID, reviewData) => {
    const updated = savedMovies.map((m) => {
      if (m.imdbID === imdbID) {
        return { ...m, ...reviewData };
      }
      return m;
    });
    setSavedMovies(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    addToast(`⭐ Rating & review saved!`);

    try {
      await fetch(`${BACKEND_URL}/${imdbID}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
    } catch (e) {
      console.log("Backend review update offline fallback");
    }
  };

  // ----------------------------------------------------
  // Import JSON Library Backup
  // ----------------------------------------------------
  const handleImportLibrary = (newMovies) => {
    const merged = [...newMovies, ...savedMovies.filter((s) => !newMovies.some((n) => n.imdbID === s.imdbID))];
    setSavedMovies(merged);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    addToast(`📥 Imported ${newMovies.length} movies into Vault!`);
  };

  // Check if movie is saved
  const isMovieSaved = (imdbID) => {
    return savedMovies.some((m) => m.imdbID === imdbID);
  };

  // Open Full Detail Modal with enrichment
  const handleOpenDetails = async (movie) => {
    setDetailMovie(movie);
    if (!movie.Plot || movie.Plot === "N/A" || !movie.Director) {
      const full = await fetchFullMovieDetails(movie.imdbID);
      if (full) {
        setDetailMovie((prev) => (prev && prev.imdbID === movie.imdbID ? { ...prev, ...full } : prev));
      }
    }
  };

  // Initial Load
  useEffect(() => {
    fetchSavedMovies();
    handleSearch("Interstellar");
  }, []);

  // Combined Master Pool for Recommendations
  const allMoviesPool = useMemo(() => {
    const map = new Map();
    seedMoviesList.forEach((m) => map.set(m.imdbID, m));
    savedMovies.forEach((m) => map.set(m.imdbID, { ...map.get(m.imdbID), ...m }));
    searchResults.forEach((m) => {
      if (!map.has(m.imdbID)) map.set(m.imdbID, m);
    });
    return Array.from(map.values());
  }, [savedMovies, searchResults]);

  // Featured Spotlight Film
  const spotlightFilm = seedMoviesList[1] || seedMoviesList[0];

  return (
    <div className="app-container">
      {/* 1. TOP NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedMovies.length}
      />

      {/* 2. TAB VIEW: EXPLORE & SEARCH */}
      {activeTab === TABS.EXPLORE && (
        <main>
          {/* Spotlight Hero */}
          <HeroSpotlight
            movie={spotlightFilm}
            onWatchTrailer={(m) => setTrailerMovie(m)}
            onOpenDetails={handleOpenDetails}
            onQuickSave={handleSaveMovie}
            isSaved={isMovieSaved(spotlightFilm.imdbID)}
          />

          {/* Search Bar */}
          <section className="search-section">
            <div className="search-bar-wrapper">
              <span className="search-icon-left">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search millions of movies, series, directors, and actors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
              />
              <button
                className="search-btn-action"
                onClick={() => handleSearch(searchTerm)}
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Trending Quick Search Chips */}
            <div className="trending-chips">
              <span className="trending-label">🔥 Trending Now:</span>
              {[
                "Dune",
                "Oppenheimer",
                "The Matrix",
                "Spirited Away",
                "The Dark Knight",
                "Interstellar",
                "Whiplash",
              ].map((term) => (
                <button
                  key={term}
                  className="chip-btn"
                  onClick={() => {
                    setSearchTerm(term);
                    handleSearch(term);
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          {/* Search Results / Discovery Grid */}
          <section className="content-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  🍿 {searchTerm ? `Results for "${searchTerm}"` : "Featured & Trending Cinema"} ({searchResults.length})
                </h2>
                <p className="section-subtitle">
                  Click on any card to view trailers, synopsis, reviews, and save to your vault
                </p>
              </div>
            </div>

            {searchResults.length > 0 ? (
              <div className="movies-grid">
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isSaved={isMovieSaved(movie.imdbID)}
                    onSave={handleSaveMovie}
                    onDelete={handleDeleteMovie}
                    onRate={handleUpdateReview}
                    onOpenDetails={handleOpenDetails}
                    onWatchTrailer={(m) => setTrailerMovie(m)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🎬</div>
                <h3>No Movies Found</h3>
                <p>Try searching for a different title, actor, or director name.</p>
              </div>
            )}
          </section>
        </main>
      )}

      {/* 3. TAB VIEW: AI VIBE RECOMMENDER */}
      {activeTab === TABS.AI_RECOMMEND && (
        <AiVibeRecommender
          allMovies={allMoviesPool}
          onOpenDetails={handleOpenDetails}
          onWatchTrailer={(m) => setTrailerMovie(m)}
          onSave={handleSaveMovie}
          onDelete={handleDeleteMovie}
          onRate={handleUpdateReview}
          isMovieSaved={isMovieSaved}
        />
      )}

      {/* 4. TAB VIEW: MOOD & GENRE EXPLORER */}
      {activeTab === TABS.MOOD_GENRE && (
        <MoodGenreExplorer
          allMovies={allMoviesPool}
          onOpenDetails={handleOpenDetails}
          onWatchTrailer={(m) => setTrailerMovie(m)}
          onSave={handleSaveMovie}
          onDelete={handleDeleteMovie}
          onRate={handleUpdateReview}
          isMovieSaved={isMovieSaved}
        />
      )}

      {/* 5. TAB VIEW: SPIN THE REEL (ROULETTE) */}
      {activeTab === TABS.SPIN_REEL && (
        <SpinTheReel
          allMovies={allMoviesPool}
          onOpenDetails={handleOpenDetails}
          onWatchTrailer={(m) => setTrailerMovie(m)}
          onSave={handleSaveMovie}
          isMovieSaved={isMovieSaved}
        />
      )}

      {/* 6. TAB VIEW: CINEMA VAULT (USER LIBRARY) */}
      {activeTab === TABS.VAULT && (
        <CinemaVault
          savedMovies={savedMovies}
          onOpenDetails={handleOpenDetails}
          onWatchTrailer={(m) => setTrailerMovie(m)}
          onSave={handleSaveMovie}
          onDelete={handleDeleteMovie}
          onRate={handleUpdateReview}
          onImportLibrary={handleImportLibrary}
        />
      )}

      {/* 7. TAB VIEW: CINEPHILE STATS & ANALYTICS */}
      {activeTab === TABS.STATS && (
        <CinephileStats savedMovies={savedMovies} />
      )}

      {/* MOVIE DETAIL MODAL */}
      {detailMovie && (
        <MovieDetailModal
          movie={detailMovie}
          onClose={() => setDetailMovie(null)}
          onWatchTrailer={(m) => setTrailerMovie(m)}
          onSave={handleSaveMovie}
          onUpdateReview={handleUpdateReview}
          onSelectMovie={handleOpenDetails}
          allMovies={allMoviesPool}
          isSaved={isMovieSaved(detailMovie.imdbID)}
        />
      )}

      {/* TRAILER PLAYER MODAL */}
      {trailerMovie && (
        <TrailerModal
          movie={trailerMovie}
          onClose={() => setTrailerMovie(null)}
        />
      )}

      {/* FLOATING TOAST NOTIFICATIONS */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast-message"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          >
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
