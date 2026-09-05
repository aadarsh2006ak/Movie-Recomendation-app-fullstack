import React from "react";

export const TABS = {
  EXPLORE: "explore",
  AI_RECOMMEND: "ai_recommend",
  MOOD_GENRE: "mood_genre",
  SPIN_REEL: "spin_reel",
  VAULT: "vault",
  STATS: "stats",
};

const Navbar = ({ activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="navbar">
      {/* Brand */}
      <div className="brand" onClick={() => setActiveTab(TABS.EXPLORE)}>
        <div className="brand-icon">🎬</div>
        <div className="brand-text">
          <h1>CineVerse</h1>
          <span className="brand-tag">AI Recommendation Engine</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="nav-tabs" role="tablist">
        <button
          className={`nav-tab-btn ${activeTab === TABS.EXPLORE ? "active" : ""}`}
          onClick={() => setActiveTab(TABS.EXPLORE)}
        >
          🔍 <span>Explore & Search</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === TABS.AI_RECOMMEND ? "active" : ""}`}
          onClick={() => setActiveTab(TABS.AI_RECOMMEND)}
        >
          ✨ <span>AI Vibe Matcher</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === TABS.MOOD_GENRE ? "active" : ""}`}
          onClick={() => setActiveTab(TABS.MOOD_GENRE)}
        >
          🎭 <span>Mood & Genre</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === TABS.SPIN_REEL ? "active" : ""}`}
          onClick={() => setActiveTab(TABS.SPIN_REEL)}
        >
          🎰 <span>Spin the Reel</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === TABS.VAULT ? "active" : ""}`}
          onClick={() => setActiveTab(TABS.VAULT)}
        >
          💾 <span>Cinema Vault</span>
          {savedCount > 0 && <span className="nav-badge">{savedCount}</span>}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === TABS.STATS ? "active" : ""}`}
          onClick={() => setActiveTab(TABS.STATS)}
        >
          📊 <span>Analytics</span>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
