import React, { useState } from "react";
import MovieCard from "../movieCard";
import { GENRE_OPTIONS, MOOD_OPTIONS } from "../data/seedMovies";

const MoodGenreExplorer = ({
  allMovies,
  onOpenDetails,
  onWatchTrailer,
  onSave,
  onDelete,
  onRate,
  isMovieSaved,
}) => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMood, setSelectedMood] = useState("All");
  const [minRating, setMinRating] = useState(7.0);
  const [decade, setDecade] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  // Filtering logic
  const filteredMovies = allMovies.filter((movie) => {
    // Genre check
    if (selectedGenre !== "All") {
      const g = (movie.Genre || "").toLowerCase();
      if (!g.includes(selectedGenre.toLowerCase())) return false;
    }

    // Mood check
    if (selectedMood !== "All") {
      const moods = movie.moods || [];
      if (!moods.includes(selectedMood)) return false;
    }

    // Rating check
    const ratingVal = parseFloat(movie.imdbRating) || 7.0;
    if (ratingVal < minRating) return false;

    // Decade check
    if (decade !== "All") {
      const year = parseInt(movie.Year) || 2000;
      if (decade === "2020s" && year < 2020) return false;
      if (decade === "2010s" && (year < 2010 || year > 2019)) return false;
      if (decade === "2000s" && (year < 2000 || year > 2009)) return false;
      if (decade === "90s" && (year < 1990 || year > 1999)) return false;
      if (decade === "classics" && year >= 1990) return false;
    }

    return true;
  });

  // Sorting logic
  filteredMovies.sort((a, b) => {
    if (sortBy === "rating") {
      return (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0);
    }
    if (sortBy === "year-desc") {
      return (parseInt(b.Year) || 0) - (parseInt(a.Year) || 0);
    }
    if (sortBy === "year-asc") {
      return (parseInt(a.Year) || 0) - (parseInt(b.Year) || 0);
    }
    if (sortBy === "title") {
      return (a.Title || "").localeCompare(b.Title || "");
    }
    return 0;
  });

  return (
    <div className="content-section">
      {/* Filter Controls Panel */}
      <div className="filter-controls-panel">
        {/* Mood Vibes */}
        <div className="filter-group-title">🎭 Filter by Emotional Vibe / Atmosphere</div>
        <div className="mood-pills-row">
          <button
            className={`filter-pill ${selectedMood === "All" ? "active" : ""}`}
            onClick={() => setSelectedMood("All")}
          >
            🌈 All Vibes
          </button>
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.id}
              className={`filter-pill ${selectedMood === mood.id ? "active" : ""}`}
              onClick={() => setSelectedMood(mood.id)}
            >
              {mood.label}
            </button>
          ))}
        </div>

        {/* Genres */}
        <div className="filter-group-title">🎬 Filter by Genre Category</div>
        <div className="genre-pills-row">
          {GENRE_OPTIONS.map((genre) => (
            <button
              key={genre}
              className={`filter-pill ${selectedGenre === genre ? "active" : ""}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Sliders & Dropdowns */}
        <div className="filter-sliders-row">
          {/* Min Rating Slider */}
          <div className="slider-item">
            <div className="slider-label">
              <span>Minimum IMDb Rating</span>
              <span style={{ color: "var(--accent-gold)", fontWeight: 700 }}>
                ⭐ {minRating.toFixed(1)}+
              </span>
            </div>
            <input
              type="range"
              min="6.0"
              max="9.5"
              step="0.1"
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="slider-input"
            />
          </div>

          {/* Era / Decade */}
          <div className="slider-item">
            <div className="slider-label">
              <span>Release Era / Decade</span>
              <span style={{ color: "var(--neon-cyan)", fontWeight: 700 }}>{decade}</span>
            </div>
            <select
              value={decade}
              onChange={(e) => setDecade(e.target.value)}
              className="vault-sort-select"
              style={{ width: "100%", padding: "0.6rem 1rem" }}
            >
              <option value="All">All Eras</option>
              <option value="2020s">2020s Modern Releases</option>
              <option value="2010s">2010s Golden Decade</option>
              <option value="2000s">2000s Millennial Hits</option>
              <option value="90s">1990s Iconic Cinema</option>
              <option value="classics">Pre-1990s Masterpieces</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="slider-item">
            <div className="slider-label">
              <span>Sort Order</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="vault-sort-select"
              style={{ width: "100%", padding: "0.6rem 1rem" }}
            >
              <option value="rating">Top Rated (IMDb)</option>
              <option value="year-desc">Release Year (Newest First)</option>
              <option value="year-asc">Release Year (Oldest First)</option>
              <option value="title">Title (A to Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">
            🍿 Matched Films ({filteredMovies.length})
          </h2>
          <p className="section-subtitle">
            Showing movies matching your vibe & genre criteria
          </p>
        </div>
      </div>

      {/* Grid */}
      {filteredMovies.length > 0 ? (
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              isSaved={isMovieSaved(movie.imdbID)}
              onSave={onSave}
              onDelete={onDelete}
              onRate={onRate}
              onOpenDetails={onOpenDetails}
              onWatchTrailer={onWatchTrailer}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No Exact Matches Found</h3>
          <p>Try lowering the rating threshold or selecting a broader genre category.</p>
        </div>
      )}
    </div>
  );
};

export default MoodGenreExplorer;
