import React, { useState } from "react";
import MovieCard from "../movieCard";
import { PROMPT_SUGGESTIONS } from "../data/seedMovies";

const AiVibeRecommender = ({
  allMovies,
  onOpenDetails,
  onWatchTrailer,
  onSave,
  onDelete,
  onRate,
  isMovieSaved,
}) => {
  const [prompt, setPrompt] = useState("");
  const [activePrompt, setActivePrompt] = useState("");
  const [results, setResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerateRecommendations = (queryPrompt) => {
    const query = (queryPrompt || prompt).trim();
    if (!query) return;

    setActivePrompt(query);
    setIsAnalyzing(true);

    setTimeout(() => {
      const keywords = query.toLowerCase().split(/\s+/).filter((k) => k.length > 2);

      const scored = allMovies.map((movie) => {
        let score = 50;
        let reasons = [];

        const plot = (movie.Plot || "").toLowerCase();
        const genre = (movie.Genre || "").toLowerCase();
        const title = (movie.Title || "").toLowerCase();
        const moods = (movie.moods || []).map((m) => m.toLowerCase());
        const director = (movie.Director || "").toLowerCase();
        const actors = (movie.Actors || "").toLowerCase();
        const imdb = parseFloat(movie.imdbRating) || 7.5;

        // Rating boost
        score += Math.round(imdb * 3.5);

        // Keyword matches
        let matchCount = 0;
        keywords.forEach((word) => {
          if (plot.includes(word)) {
            matchCount += 2;
            score += 12;
          }
          if (genre.includes(word)) {
            matchCount += 2;
            score += 15;
            reasons.push(`Genre match: ${word}`);
          }
          if (moods.some((m) => m.includes(word))) {
            matchCount += 2;
            score += 15;
            reasons.push(`Vibe fit: ${word}`);
          }
          if (director.includes(word) || actors.includes(word)) {
            matchCount += 2;
            score += 18;
            reasons.push(`Cast/Director synergy: ${word}`);
          }
          if (title.includes(word)) {
            matchCount += 3;
            score += 20;
          }
        });

        // Theme inference
        if (query.toLowerCase().includes("mind") || query.toLowerCase().includes("twist") || query.toLowerCase().includes("sci-fi")) {
          if (genre.includes("sci-fi") || moods.some((m) => m.includes("mind"))) {
            score += 20;
            reasons.push("Reality-bending narrative architecture");
          }
        }
        if (query.toLowerCase().includes("dark") || query.toLowerCase().includes("gritty") || query.toLowerCase().includes("crime")) {
          if (genre.includes("crime") || genre.includes("thriller")) {
            score += 20;
            reasons.push("Atmospheric suspense and high stakes");
          }
        }
        if (query.toLowerCase().includes("feel-good") || query.toLowerCase().includes("heart") || query.toLowerCase().includes("cozy")) {
          if (genre.includes("romance") || genre.includes("animation") || genre.includes("comedy")) {
            score += 20;
            reasons.push("Uplifting and heartwarming narrative");
          }
        }

        if (reasons.length === 0) {
          if (imdb >= 8.5) reasons.push("Critically acclaimed all-time masterpiece");
          else reasons.push("High community praise & immersive pacing");
        }

        const matchPercent = Math.min(Math.max(score, 72), 99);

        return {
          ...movie,
          matchScore: matchPercent,
          matchReason: reasons[0],
        };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);
      setResults(scored.slice(0, 10));
      setIsAnalyzing(false);
    }, 450);
  };

  return (
    <div className="content-section">
      <div className="ai-recommender-container">
        <div className="ai-header">
          <h2>✨ AI Vibe Matcher & Natural Language Concierge</h2>
          <p>
            Describe your ideal movie vibe, atmosphere, plot concept, or mix of favorite films in plain words.
          </p>
        </div>

        {/* Input Bar */}
        <div className="ai-prompt-box">
          <input
            type="text"
            className="ai-prompt-input"
            placeholder="e.g., Mind-bending sci-fi thriller with huge plot twists like Inception or The Matrix..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerateRecommendations()}
          />
          <button
            className="btn-ai-generate"
            onClick={() => handleGenerateRecommendations()}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "🔮 Match My Vibe"}
          </button>
        </div>

        {/* Prompt Suggestions */}
        <div className="ai-prompt-suggestions">
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
            Try a prompt:
          </span>
          {PROMPT_SUGGESTIONS.map((sugg, idx) => (
            <button
              key={idx}
              className="suggestion-chip"
              onClick={() => {
                setPrompt(sugg);
                handleGenerateRecommendations(sugg);
              }}
            >
              💡 {sugg}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      {activePrompt && (
        <div className="section-header">
          <div>
            <h2 className="section-title">
              🎯 Matched Recommendations ({results.length})
            </h2>
            <p className="section-subtitle">
              Ranked by semantic match with: <em>"{activePrompt}"</em>
            </p>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="movies-grid">
          {results.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              matchScore={movie.matchScore}
              matchReason={movie.matchReason}
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
        !isAnalyzing && (
          <div className="empty-state">
            <div className="empty-state-icon">🤖</div>
            <h3>Your Personal AI Cinema Concierge</h3>
            <p>Type a mood or click any suggestion chip above to instantly generate tailored recommendations!</p>
          </div>
        )
      )}
    </div>
  );
};

export default AiVibeRecommender;
