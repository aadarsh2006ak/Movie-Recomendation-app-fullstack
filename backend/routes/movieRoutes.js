// ============================================================
// Movie Routes - Define all API endpoints for movies
// ============================================================
// These routes connect the URL paths to the controller functions.

import express from "express";
import {
  getAllMovies,
  saveMovie,
  deleteMovie,
  getRecommendation,
  getPopularMovies,
  rateMovie,
} from "../controllers/movieController.js";

const router = express.Router();

// ========== API ROUTES ==========

// GET  /api/movies           -> Get all saved movies
router.get("/", getAllMovies);

// POST /api/movies           -> Save a new movie
router.post("/", saveMovie);

// DELETE /api/movies/:imdbID -> Remove a movie by its IMDB ID
router.delete("/:imdbID", deleteMovie);

// GET /api/movies/recommend  -> Get a random movie recommendation
router.get("/recommend", getRecommendation);

// GET /api/movies/popular    -> Get top 5 most popular movies
router.get("/popular", getPopularMovies);

// PUT /api/movies/:imdbID/rate -> Rate a movie (1-5 stars)
router.put("/:imdbID/rate", rateMovie);

export default router;

