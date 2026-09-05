import React, { useState } from "react";
import MovieCard from "../movieCard";

const CinemaVault = ({
  savedMovies,
  onOpenDetails,
  onWatchTrailer,
  onSave,
  onDelete,
  onRate,
  onImportLibrary,
}) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  // Filtering
  const filtered = savedMovies.filter((movie) => {
    // Status filter
    if (activeFilter !== "all" && movie.userStatus !== activeFilter) {
      // If activeFilter is favorites and user marked favorite
      if (activeFilter === "favorite" && movie.userStatus !== "favorite") return false;
      if (activeFilter === "watchlist" && movie.userStatus !== "watchlist") return false;
      if (activeFilter === "watched" && movie.userStatus !== "watched") return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = (movie.Title || "").toLowerCase().includes(q);
      const matchDirector = (movie.Director || "").toLowerCase().includes(q);
      const matchGenre = (movie.Genre || "").toLowerCase().includes(q);
      if (!matchTitle && !matchDirector && !matchGenre) return false;
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === "rating-user") {
      return (b.userRating || 0) - (a.userRating || 0);
    }
    if (sortBy === "rating-imdb") {
      return (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0);
    }
    if (sortBy === "year-desc") {
      return (parseInt(b.Year) || 0) - (parseInt(a.Year) || 0);
    }
    if (sortBy === "title") {
      return (a.Title || "").localeCompare(b.Title || "");
    }
    return 0;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedMovies, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cineverse_library_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileInput = (e) => {
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            onImportLibrary(parsed);
          }
        } catch (err) {
          alert("Invalid JSON file");
        }
      };
    }
  };

  const watchlistCount = savedMovies.filter((m) => m.userStatus === "watchlist").length;
  const favoritesCount = savedMovies.filter((m) => m.userStatus === "favorite").length;
  const watchedCount = savedMovies.filter((m) => m.userStatus === "watched").length;

  return (
    <div className="content-section">
      {/* Vault Header */}
      <div className="vault-header">
        <div>
          <h2 className="section-title">
            💾 My Cinema Vault ({savedMovies.length})
          </h2>
          <p className="section-subtitle">
            Your personal curated film watchlist, ratings, and diary
          </p>
        </div>

        {/* Tools (Export / Import) */}
        <div className="vault-tools">
          <button
            className="chip-btn"
            onClick={handleExportJSON}
            title="Download JSON backup"
          >
            📥 Export Backup
          </button>
          <label className="chip-btn" style={{ cursor: "pointer" }}>
            📤 Import JSON
            <input
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleFileInput}
            />
          </label>
        </div>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div className="vault-filter-tabs">
          <button
            className={`vault-tab ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Items ({savedMovies.length})
          </button>
          <button
            className={`vault-tab ${activeFilter === "favorite" ? "active" : ""}`}
            onClick={() => setActiveFilter("favorite")}
          >
            💖 Favorites ({favoritesCount})
          </button>
          <button
            className={`vault-tab ${activeFilter === "watchlist" ? "active" : ""}`}
            onClick={() => setActiveFilter("watchlist")}
          >
            🔖 Watchlist ({watchlistCount})
          </button>
          <button
            className={`vault-tab ${activeFilter === "watched" ? "active" : ""}`}
            onClick={() => setActiveFilter("watched")}
          >
            ✅ Watched ({watchedCount})
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Filter library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="vault-sort-select"
            style={{ width: "200px" }}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="vault-sort-select"
          >
            <option value="date-desc">Newest Added</option>
            <option value="rating-user">My Rating (Highest)</option>
            <option value="rating-imdb">IMDb Rating</option>
            <option value="year-desc">Release Year</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="movies-grid">
          {filtered.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              isSaved={true}
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
          <div className="empty-state-icon">🎬</div>
          <h3>Your Library is Empty Here</h3>
          <p>
            {savedMovies.length === 0
              ? "Start searching or explore recommendations to add films to your Cinema Vault!"
              : "No movies matching this specific filter."}
          </p>
        </div>
      )}
    </div>
  );
};

export default CinemaVault;
