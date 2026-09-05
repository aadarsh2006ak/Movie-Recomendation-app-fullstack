import React from "react";

const MovieCard = ({
  movie,
  isSaved,
  matchScore,
  matchReason,
  onSave,
  onDelete,
  onRate,
  onOpenDetails,
  onWatchTrailer,
}) => {
  const imdbID = movie.imdbID;
  const Year = movie.Year;
  const Poster = movie.Poster;
  const Title = movie.Title;
  const Type = movie.Type || "movie";
  const rating = movie.userRating || (movie.rating && movie.rating > 0 ? movie.rating : null);
  const imdbRating = movie.imdbRating || "8.5";

  const posterSrc =
    Poster && Poster !== "N/A"
      ? Poster
      : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="movie-card" key={imdbID}>
      {/* Poster Container */}
      <div className="card-poster-wrapper">
        <img
          src={posterSrc}
          alt={Title}
          className="card-poster"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* Top Badges */}
        <div className="card-badges-top">
          <span className="card-type-badge">{Type}</span>
          <span className="card-rating-badge">⭐ {imdbRating}</span>
        </div>

        {/* Match score if recommended */}
        {matchScore && (
          <div className="card-match-badge">
            ⚡ {matchScore}% Match
          </div>
        )}

        {/* Quick Action Hover Overlay */}
        <div className="card-overlay">
          <div className="card-overlay-actions">
            <button
              className="btn-card-action primary"
              onClick={() => onWatchTrailer(movie)}
              title="Watch Trailer"
            >
              ▶ Trailer
            </button>
            <button
              className="btn-card-action secondary"
              onClick={() => onOpenDetails(movie)}
              title="View Full Details"
            >
              ℹ️ Details
            </button>
            <button
              className="btn-card-action secondary"
              onClick={() => {
                if (isSaved) {
                  onDelete(imdbID, Title);
                } else {
                  onSave(movie);
                }
              }}
              title={isSaved ? "Remove from Vault" : "Save to Vault"}
            >
              {isSaved ? "❌" : "💾"}
            </button>
          </div>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="card-body">
        <div>
          <h3 className="card-title" onClick={() => onOpenDetails(movie)}>
            {Title}
          </h3>

          {matchReason && (
            <div className="recommendation-reasons-tag">
              💡 {matchReason}
            </div>
          )}
        </div>

        <div className="card-meta-bottom">
          <span>{Year}</span>

          {movie.userStatus && movie.userStatus !== "none" && (
            <span className={`card-user-status-pill ${movie.userStatus}`}>
              {movie.userStatus === "favorite" && "💖 Fav"}
              {movie.userStatus === "watchlist" && "🔖 Watchlist"}
              {movie.userStatus === "watched" && "✅ Watched"}
            </span>
          )}

          {rating && (
            <span style={{ color: "var(--accent-gold)", fontWeight: 700 }}>
              ★ {rating}/10
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
