# 🎬 CineVerse AI — Backend API

Express & MongoDB backend for the CineVerse Movie Recommendation platform.

## 🚀 Features
- **Hybrid Recommendation Engine**: AI semantic matching, vibe matching, and content-based similarity.
- **Auto-Seeding**: Seeds 27+ top-rated movies automatically into MongoDB if empty.
- **RESTful Endpoints**: Movie CRUD, user status (watchlist, favorites, watched), star ratings, and cinephile analytics.

## 🛠️ Setup & Installation
```bash
# Install dependencies
npm install

# Configure environment variables in .env (see .env.example)
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OMDB_API_KEY=your_omdb_api_key

# Run development server
npm run dev
```

## 📡 API Endpoints
- `GET /api/movies` — Fetch saved library (supports `status`, `genre`, `sortBy`)
- `POST /api/movies` — Save or upsert movie
- `GET /api/movies/details/:imdbID` — Get full movie details
- `GET /api/movies/recommend/smart` — Multi-factor smart recommendations
- `GET /api/movies/recommend/similar/:imdbID` — Content-based similar films
- `GET /api/movies/curated` — Curated thematic collections
- `GET /api/movies/stats` — Cinephile watch analytics
- `PUT /api/movies/:imdbID/review` — Save star rating & user review
- `PUT /api/movies/:imdbID/status` — Update watch status (watchlist/favorite/watched)
- `DELETE /api/movies/:imdbID` — Remove film from library
