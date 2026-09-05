import React, { useState, useEffect } from "react";
import { GENRE_OPTIONS } from "../data/seedMovies";

const SpinTheReel = ({
  allMovies,
  onOpenDetails,
  onWatchTrailer,
  onSave,
  isMovieSaved,
}) => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [currentDisplayMovie, setCurrentDisplayMovie] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  // Eligible pool
  const pool = allMovies.filter((m) => {
    if (selectedGenre === "All") return true;
    return (m.Genre || "").toLowerCase().includes(selectedGenre.toLowerCase());
  });

  useEffect(() => {
    if (pool.length > 0 && !currentDisplayMovie) {
      setCurrentDisplayMovie(pool[0]);
    }
  }, [pool]);

  const handleSpin = () => {
    if (pool.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setHasSpun(true);

    let speed = 60;
    let stepCount = 0;
    const maxSteps = 22;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setCurrentDisplayMovie(pool[randomIndex]);
      stepCount++;

      if (stepCount >= maxSteps) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, speed);
  };

  return (
    <div className="content-section">
      <div className="roulette-container">
        <div className="roulette-header">
          <h2>🎰 Spin the Cine-Reel</h2>
          <p>
            Can't decide what to watch tonight? Let the CineVerse roulette pick a critically acclaimed masterpiece for you!
          </p>

          {/* Genre constraint */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 600 }}>
              Optional Genre Filter:
            </span>
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setHasSpun(false);
              }}
              className="vault-sort-select"
              disabled={isSpinning}
            >
              {GENRE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g === "All" ? "Any Genre" : g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display Card */}
        {currentDisplayMovie && (
          <div className="reel-display-card">
            <div className="reel-poster-box">
              <img
                src={
                  currentDisplayMovie.Poster !== "N/A"
                    ? currentDisplayMovie.Poster
                    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80"
                }
                alt={currentDisplayMovie.Title}
                className="reel-poster"
              />
            </div>

            <div className="reel-info-box">
              <h3>{currentDisplayMovie.Title}</h3>
              <p>
                {currentDisplayMovie.Year} • ⭐ {currentDisplayMovie.imdbRating || "8.5"} • {currentDisplayMovie.Genre}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {currentDisplayMovie.Plot}
              </p>

              {hasSpun && !isSpinning && (
                <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem", justifyContent: "center" }}>
                  <button
                    className="btn-card-action primary"
                    onClick={() => onWatchTrailer(currentDisplayMovie)}
                  >
                    ▶ Watch Trailer
                  </button>
                  <button
                    className="btn-card-action secondary"
                    onClick={() => onOpenDetails(currentDisplayMovie)}
                  >
                    ℹ️ Details
                  </button>
                  <button
                    className="btn-card-action secondary"
                    onClick={() => onSave(currentDisplayMovie)}
                  >
                    {isMovieSaved(currentDisplayMovie.imdbID) ? "✅ Saved" : "💾 Add"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spin Button */}
        <button
          className="btn-spin-wheel"
          onClick={handleSpin}
          disabled={isSpinning || pool.length === 0}
        >
          {isSpinning ? "🌀 Rolling the Reels..." : "🎲 Spin the Reel & Pick!"}
        </button>
      </div>
    </div>
  );
};

export default SpinTheReel;
