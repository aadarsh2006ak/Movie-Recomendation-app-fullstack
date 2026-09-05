import React from "react";

const TrailerModal = ({ movie, onClose }) => {
  if (!movie) return null;

  // If trailerId exists use it, otherwise use YouTube embed search query
  const videoSrc = movie.trailerId
    ? `https://www.youtube-nocookie.com/embed/${movie.trailerId}?autoplay=1&rel=0`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(
        `${movie.Title} ${movie.Year} Official Trailer HD`
      )}&autoplay=1`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="video-responsive-wrapper">
          <iframe
            src={videoSrc}
            title={`${movie.Title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div style={{ padding: "1.25rem 1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0e131f" }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "1.2rem" }}>
              🎬 {movie.Title} ({movie.Year}) — Official Trailer
            </h3>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              ⭐ {movie.imdbRating || "8.5"} • {movie.Genre}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
