import React, { useState } from "react";

const MovieCard = ({ movie, isSaved, onSave, onDelete, onRate }) => {
  const [showRating, setShowRating] = useState(false);

  // Get movie data - works for both OMDB results and saved MongoDB entries
  const imdbID = movie.imdbID;
  const Year = movie.Year;
  const Poster = movie.Poster;
  const Title = movie.Title;
  const Type = movie.Type;

  // Rating from saved movies (MongoDB)
  const rating = movie.rating || 0;

  return (
    <div className="movie" key={imdbID}>
      {/* Year Badge */}
      <div>
        <p>{Year}</p>
      </div>

      {/* Poster Image */}
      <div>
        <img
          src={Poster !== "N/A" ? Poster : "https://via.placeholder.com/400"}
          alt={Title}
        />
      </div>

      {/* Movie Info & Buttons */}
      <div>
        <span>{Type}</span>
        <h3>{Title}</h3>

        {/* Rating Stars */}
        {rating > 0 && (
          <p className="rating-stars">
            {"⭐".repeat(Math.round(rating))} <small>({rating})</small>
          </p>
        )}

        {/* Action Buttons */}
        <div className="movie-actions">
          {isSaved ? (
            <>
              {/* DELETE BUTTON - removes from MongoDB */}
              <button
                className="btn-delete"
                onClick={() => onDelete(imdbID, Title)}
              >
                ❌ Remove
              </button>

              {/* RATE BUTTON - shows rating options */}
              <button
                className="btn-rate"
                onClick={() => setShowRating(!showRating)}
              >
                ⭐ Rate
              </button>
            </>
          ) : (
            <>
              {/* SAVE BUTTON - saves to MongoDB */}
              <button
                className="btn-save"
                onClick={() => onSave(movie)}
              >
                💾 Save to Favorites
              </button>
            </>
          )}
        </div>

        {/* Rating Picker (1-5 stars) */}
        {showRating && (
          <div className="rating-picker">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="star-btn"
                onClick={() => {
                  onRate(imdbID, star);
                  setShowRating(false);
                }}
              >
                {star}⭐
              </button>
            ))}
          </div>
        )}

        {/* Popularity badge (for saved movies) */}
        {movie.popularity > 1 && (
          <p className="popularity-badge">🔥 Saved {movie.popularity} times</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;

