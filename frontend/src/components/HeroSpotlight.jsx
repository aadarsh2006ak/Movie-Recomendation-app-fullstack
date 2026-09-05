import React from "react";

const HeroSpotlight = ({ movie, onWatchTrailer, onOpenDetails, onQuickSave, isSaved }) => {
  if (!movie) return null;

  return (
    <div className="hero-spotlight">
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80"}
        alt={movie.Title}
        className="hero-backdrop"
      />
      <div className="hero-gradient-overlay" />

      <div className="hero-content">
        <div className="hero-featured-badge">
          🔥 SPOTLIGHT FILM OF THE DAY
        </div>

        <h1 className="hero-title">{movie.Title}</h1>

        <div className="hero-meta-row">
          <span className="hero-rating">⭐ {movie.imdbRating || "8.8"} / 10</span>
          <span>•</span>
          <span className="hero-meta-badge">{movie.Year}</span>
          <span>•</span>
          <span>{movie.Runtime || "148 min"}</span>
          <span>•</span>
          <span className="hero-meta-badge">{movie.Genre ? movie.Genre.split(",")[0] : "Sci-Fi"}</span>
        </div>

        <p className="hero-plot">
          {movie.Plot && movie.Plot !== "N/A"
            ? movie.Plot
            : "Dive into a masterfully crafted cinematic journey with extraordinary performances, gripping screenplay, and world-class direction."}
        </p>

        <div className="hero-actions">
          <button
            className="btn-hero-primary"
            onClick={() => onWatchTrailer(movie)}
          >
            ▶ Watch Trailer
          </button>

          <button
            className="btn-hero-secondary"
            onClick={() => onOpenDetails(movie)}
          >
            ℹ️ Film Details
          </button>

          <button
            className="btn-hero-secondary"
            onClick={() => onQuickSave(movie)}
          >
            {isSaved ? "✅ Saved in Vault" : "💾 Add to Watchlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSpotlight;
