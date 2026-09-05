# 🎬 CineVerse AI — Full-Stack Movie Recommendation & Cinephile Platform

[![React](https://img.shields.io/badge/React-19.2-61dafb.svg?style=flat&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**CineVerse AI** is a modern, full-stack movie recommendation platform and cinephile diary built with **React 19**, **Node.js/Express**, **MongoDB Atlas**, and the **OMDB API**. It combines smart natural language vibe matching, multi-factor genre/decade exploration, an interactive "Spin the Reel" roulette, full movie synopsis & HD trailer players, and a personal Cinema Vault with 10-star rating journals and analytics.

---

## ✨ Features

- 🔮 **AI Vibe & Semantic Matcher**: Describe your mood or ideal plot concept in natural language (*e.g., "Mind-bending 90s thriller with big plot twists"*) to get smart matches with percentage scores and rationale tags.
- 🎭 **Mood & Multi-Genre Explorer**: Filter across emotional vibes (*Mind-Bending, Adrenaline Rush, Feel-Good, Dark & Gritty, Epic Worlds*), genres, release decades (2020s down to classics), and minimum IMDb rating thresholds.
- 🎰 **Spin the Reel (Roulette)**: Interactive cinematic randomizer for when you can't decide what to watch.
- 🔍 **Live Search & Autocomplete**: Real-time OMDB movie search with instant trending chips.
- ℹ️ **Deep-Dive Movie Details**: Full plot synopsis, cast, director, awards, box office, metascore, and content-based similar movie recommendations.
- ▶ **Embedded HD Trailer Player**: Watch high-definition YouTube trailers directly within the app.
- 💾 **Personal Cinema Vault**: Organize movies into **Favorites**, **Watchlist**, and **Watched** with 10-star rating pickers and personal review diaries.
- 📊 **Cinephile Analytics**: Visual taste profile breakdown, total estimated watch hours, and genre distribution progress bars.
- 📥 **Export & Import Backup**: Download or restore your entire movie vault as a JSON file anytime.
- 🔒 **Secure Environment Variables**: All API keys, database strings, and port configurations are kept in `.env` files with `.gitignore` protection.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS Design System (Glassmorphism + Neon accents), Responsive UI.
- **Backend**: Node.js, Express, Mongoose (MongoDB Atlas), CORS, Dotenv.
- **External API**: OMDB API (Open Movie Database) + YouTube Video Embeds.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/aadarsh2006ak/Movie-Recomendation-app-fullstack.git
cd Movie-Recomendation-app-fullstack
```

### 2. Configure Environment Variables

#### Backend (`backend/.env`):
Create a `.env` file in the `backend/` directory (see `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
OMDB_API_KEY=your_omdb_api_key
OMDB_API_BASE_URL=https://www.omdbapi.com/
CLIENT_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`):
Create a `.env` file in the `frontend/` directory (see `frontend/.env.example`):
```env
VITE_OMDB_API_KEY=your_omdb_api_key
VITE_OMDB_API_URL=https://www.omdbapi.com/
VITE_BACKEND_URL=http://localhost:5000/api/movies
```

---

### 3. Install Dependencies & Run

#### Backend:
```bash
cd backend
npm install
npm run dev
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

The application will be live at `http://localhost:5173` (or the port shown in your terminal).

---

## 📁 Project Structure

```
Movie-Recomendation-app-fullstack/
├── backend/
│   ├── config/             # Database connection setup
│   ├── controllers/        # Movie CRUD, recommendations, and stats logic
│   ├── data/               # Seed catalog for instant discovery
│   ├── models/             # Mongoose Movie Schema
│   ├── routes/             # REST API routes
│   ├── .env.example        # Backend env template
│   ├── README.md           # Backend documentation
│   ├── package.json
│   └── server.js           # Express app entrypoint
│
├── frontend/
│   ├── public/             # Static assets & icons
│   ├── src/
│   │   ├── components/     # Navbar, HeroSpotlight, AI Vibe Matcher, etc.
│   │   ├── data/           # Curated seed database
│   │   ├── App.css         # Glassmorphic Cinema Design System
│   │   ├── App.jsx         # Main App component & state
│   │   ├── main.jsx        # React root
│   │   └── movieCard.jsx   # Interactive Movie Card
│   ├── .env.example        # Frontend env template
│   ├── README.md           # Frontend documentation
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore              # Protects .env, node_modules, and dist
└── README.md               # Main Project documentation
```

---

## 📜 License
This project is licensed under the MIT License.
