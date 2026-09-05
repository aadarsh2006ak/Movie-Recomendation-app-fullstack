import React, { useState } from "react";

const MovieDetailModal = ({
  movie,
  onClose,
  onWatchTrailer,
  onSave,
  onUpdateReview,
  onSelectMovie,
  allMovies,
  isSaved,
}) => {
  if (!movie) return null;

  const [personalRating, setPersonalRating] = useState(movie.userRating || 0);
  const [personalReview, setPersonalReview] = useState(movie.userReview || "");
  const [personalStatus, setPersonalStatus] = useState(movie.userStatus || "none");
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Compute similar movies from current pool
  const movieGenres = (movie.Genre || "").toLowerCase().split(",").map((g) => g.trim());
  const similarMovies = allMovies
    .filter((m) => m.imdbID !== movie.imdbID)
    .map((m) => {
      let score = 0;
      const targetGenres = (m.Genre || "").toLowerCase().split(",").map((g) => g.trim());
      const shared = movieGenres.filter((g) => targetGenres.includes(g));
      score += shared.length * 30;
      if (m.Director && movie.Director && m.Director === movie.Director) score += 40;
      return { ...m, simScore: score };
    })
    .filter((m) => m.simScore > 0)
    .sort((a, b) => b.simScore - a.simScore)
    .slice(0, 4);

  const handleSaveReview = () => {
    onUpdateReview(movie.imdbID, {
      userRating: personalRating,
      userReview: personalReview,
      userStatus: personalStatus === "none" ? "watched" : personalStatus,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Modal Hero Banner */}
        <div className="modal-hero">
          <img
            src={
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"
            }
            alt={movie.Title}
            className="modal-backdrop-img"
          />
          <div className="modal-hero-gradient" />

          <div className="modal-hero-info">
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80"
              }
              alt={movie.Title}
              className="modal-poster-thumb"
            />

            <div className="modal-hero-text">
              <h2>{movie.Title}</h2>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ color: "var(--accent-gold)", fontWeight: 700 }}>
                  ⭐ {movie.imdbRating || "8.5"} / 10 IMDb
                </span>
                <span>•</span>
                <span>{movie.Year}</span>
                <span>•</span>
                <span>{movie.Runtime || "120 min"}</span>
                <span>•</span>
                <span className="card-type-badge">{movie.Type || "movie"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Action Row */}
          <div style={{ display: "flex", gap: "0.8rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <button
              className="btn-hero-primary"
              style={{ padding: "0.7rem 1.4rem", fontSize: "0.95rem" }}
              onClick={() => onWatchTrailer(movie)}
            >
              ▶ Watch Trailer HD
            </button>

            <button
              className="btn-hero-secondary"
              style={{ padding: "0.7rem 1.4rem", fontSize: "0.95rem" }}
              onClick={() => {
                const nextStatus = isSaved ? "none" : "favorite";
                setPersonalStatus(nextStatus);
                onSave({ ...movie, userStatus: nextStatus });
              }}
            >
              {isSaved ? "💖 In Your Vault" : "💾 Save to Vault"}
            </button>
          </div>

          {/* Metadata Grid */}
          <div className="modal-meta-grid">
            <div>
              <div className="meta-item-label">Genre</div>
              <div className="meta-item-value">{movie.Genre || "Action, Drama"}</div>
            </div>

            <div>
              <div className="meta-item-label">Director</div>
              <div className="meta-item-value">{movie.Director || "N/A"}</div>
            </div>

            <div>
              <div className="meta-item-label">Starring Cast</div>
              <div className="meta-item-value">{movie.Actors || "N/A"}</div>
            </div>

            <div>
              <div className="meta-item-label">Box Office / Metascore</div>
              <div className="meta-item-value">
                {movie.BoxOffice ? `${movie.BoxOffice} • ` : ""}
                {movie.Metascore && movie.Metascore !== "N/A" ? `Meta: ${movie.Metascore}/100` : "Top Rated"}
              </div>
            </div>

            <div>
              <div className="meta-item-label">Awards & Recognition</div>
              <div className="meta-item-value">{movie.Awards || "Award Nominated"}</div>
            </div>

            <div>
              <div className="meta-item-label">Language / Country</div>
              <div className="meta-item-value">
                {movie.Language || "English"} ({movie.Country || "USA"})
              </div>
            </div>
          </div>

          {/* Plot Synopsis */}
          <h3 className="section-title" style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}>
            📖 Story Synopsis
          </h3>
          <p className="modal-plot">
            {movie.Plot && movie.Plot !== "N/A"
              ? movie.Plot
              : "No extended synopsis provided for this title."}
          </p>

          {/* Personal Cinephile Journal */}
          <div className="user-journal-box">
            <div className="journal-title">
              <span>✍️ My Cinephile Journal & Star Rating</span>
            </div>

            {/* Status Selectors */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <button
                className={`filter-pill ${personalStatus === "favorite" ? "active" : ""}`}
                onClick={() => setPersonalStatus("favorite")}
              >
                💖 Favorite
              </button>
              <button
                className={`filter-pill ${personalStatus === "watchlist" ? "active" : ""}`}
                onClick={() => setPersonalStatus("watchlist")}
              >
                🔖 Want to Watch
              </button>
              <button
                className={`filter-pill ${personalStatus === "watched" ? "active" : ""}`}
                onClick={() => setPersonalStatus("watched")}
              >
                ✅ Watched
              </button>
            </div>

            {/* Star Rating 1-10 */}
            <div style={{ marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                My Rating:{" "}
                <strong style={{ color: "var(--accent-gold)" }}>
                  {personalRating > 0 ? `${personalRating} / 10 Stars` : "Not rated yet"}
                </strong>
              </span>
            </div>
            <div className="star-rating-picker">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  className={`star-pick-btn ${personalRating >= star ? "active" : ""}`}
                  onClick={() => setPersonalRating(star)}
                  title={`Rate ${star}/10`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Personal Notes */}
            <textarea
              className="review-textarea"
              placeholder="Write your personal thoughts, memorable scenes, quotes, or review for this film..."
              value={personalReview}
              onChange={(e) => setPersonalReview(e.target.value)}
            />

            <button
              className="btn-ai-generate"
              style={{ padding: "0.6rem 1.4rem", fontSize: "0.9rem" }}
              onClick={handleSaveReview}
            >
              {savedFeedback ? "✅ Journal Saved!" : "💾 Save Journal Entry"}
            </button>
          </div>

          {/* Similar Movies Carousel */}
          {similarMovies.length > 0 && (
            <div>
              <h3 className="section-title" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                🔮 If You Liked This, You'll Love:
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                {similarMovies.map((sim) => (
                  <div
                    key={sim.imdbID}
                    style={{
                      background: "var(--bg-surface-elevated)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.6rem",
                      cursor: "pointer",
                      border: "1px solid var(--border-subtle)",
                      transition: "transform 0.2s ease",
                    }}
                    onClick={() => onSelectMovie(sim)}
                  >
                    <img
                      src={sim.Poster !== "N/A" ? sim.Poster : "https://via.placeholder.com/200"}
                      alt={sim.Title}
                      style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "4px", marginBottom: "0.5rem" }}
                    />
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {sim.Title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--accent-gold)" }}>
                      ⭐ {sim.imdbRating || "8.5"} • {sim.Year}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
