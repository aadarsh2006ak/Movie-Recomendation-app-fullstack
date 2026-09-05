import React from "react";

const CinephileStats = ({ savedMovies }) => {
  // Compute analytics
  let totalMinutes = 0;
  const genreCounts = {};
  let totalRatingSum = 0;
  let ratedCount = 0;

  savedMovies.forEach((m) => {
    // Runtime
    if (m.Runtime) {
      const match = m.Runtime.match(/(\d+)/);
      if (match) {
        totalMinutes += parseInt(match[1]);
      }
    } else {
      totalMinutes += 120; // default average
    }

    // Genres
    if (m.Genre) {
      const genres = m.Genre.split(",").map((g) => g.trim());
      genres.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    }

    // User Rating
    if (m.userRating && m.userRating > 0) {
      ratedCount++;
      totalRatingSum += m.userRating;
    }
  });

  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const avgRating = ratedCount > 0 ? (totalRatingSum / ratedCount).toFixed(1) : "N/A";
  const watchedCount = savedMovies.filter((m) => m.userStatus === "watched").length;
  const favoritesCount = savedMovies.filter((m) => m.userStatus === "favorite").length;
  const watchlistCount = savedMovies.filter((m) => m.userStatus === "watchlist").length;

  const topGenres = Object.entries(genreCounts)
    .map(([name, count]) => ({
      name,
      count,
      percent: savedMovies.length > 0 ? Math.round((count / savedMovies.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">📊 Cinephile Analytics & Taste Profile</h2>
          <p className="section-subtitle">
            Insights based on your saved library, ratings, and watch logs
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box">🎬</div>
          <div>
            <div className="stat-value">{savedMovies.length}</div>
            <div className="stat-label">Total Films in Library</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ color: "var(--neon-cyan)", background: "rgba(6, 182, 212, 0.15)" }}>
            ⏱️
          </div>
          <div>
            <div className="stat-value">{totalHours}h</div>
            <div className="stat-label">Total Watch Hours</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ color: "var(--accent-gold)", background: "rgba(251, 191, 36, 0.15)" }}>
            ⭐
          </div>
          <div>
            <div className="stat-value">{avgRating} {avgRating !== "N/A" && "/ 10"}</div>
            <div className="stat-label">Average User Rating Given</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ color: "var(--neon-rose)", background: "rgba(244, 63, 94, 0.15)" }}>
            💖
          </div>
          <div>
            <div className="stat-value">{favoritesCount}</div>
            <div className="stat-label">Hall of Fame Favorites</div>
          </div>
        </div>
      </div>

      {/* Genre Breakdown & Tastes */}
      <div className="genre-breakdown-card">
        <h3 className="section-title" style={{ fontSize: "1.3rem", marginBottom: "1.5rem" }}>
          🧬 Top Genre Preferences & DNA
        </h3>

        {topGenres.length > 0 ? (
          <div>
            {topGenres.map((genre) => (
              <div key={genre.name} className="genre-bar-item">
                <div className="genre-bar-header">
                  <span>{genre.name}</span>
                  <span style={{ color: "var(--neon-cyan)" }}>
                    {genre.count} films ({genre.percent}%)
                  </span>
                </div>
                <div className="genre-bar-track">
                  <div
                    className="genre-bar-fill"
                    style={{ width: `${Math.min(genre.percent, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: "2rem" }}>
            <p>Save more movies into your vault to build your cinephile taste profile!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CinephileStats;
