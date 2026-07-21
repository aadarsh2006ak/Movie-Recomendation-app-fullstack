// ============================================================
// Movie Controller - All the logic for our API endpoints
// ============================================================
// Each function handles a specific request from the frontend.

import Movie from "../models/Movie.js";

// ----------------------------------------------------------
// GET /api/movies - Get ALL saved movies from database
// ----------------------------------------------------------
export const getAllMovies = async (req, res) => {
  try {
    // Find all movies, sorted by newest first
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------
// POST /api/movies - Save a NEW movie to database
// ----------------------------------------------------------
export const saveMovie = async (req, res) => {
  try {
    const { imdbID, Title, Year, Type, Poster } = req.body;

    // Check if movie already exists in DB
    const existingMovie = await Movie.findOne({ imdbID });

    if (existingMovie) {
      // If movie exists, increase its popularity count
      existingMovie.popularity += 1;
      await existingMovie.save();
      return res.json({
        success: true,
        message: "Movie popularity updated!",
        data: existingMovie,
      });
    }

    // Create new movie entry
    const newMovie = await Movie.create({
      imdbID,
      Title,
      Year,
      Type,
      Poster,
    });

    res.status(201).json({
      success: true,
      message: "Movie saved successfully!",
      data: newMovie,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------
// DELETE /api/movies/:imdbID - Remove a movie from database
// ----------------------------------------------------------
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findOneAndDelete({
      imdbID: req.params.imdbID,
    });

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    res.json({ success: true, message: "Movie removed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------
// GET /api/movies/recommend - Get a RANDOM movie recommendation
// ----------------------------------------------------------
export const getRecommendation = async (req, res) => {
  try {
    // Count total movies in DB
    const count = await Movie.countDocuments();

    if (count === 0) {
      return res.json({
        success: true,
        message: "No movies in database yet. Start searching!",
        data: null,
      });
    }

    // Get a random movie
    const randomIndex = Math.floor(Math.random() * count);
    const randomMovie = await Movie.findOne().skip(randomIndex);

    res.json({ success: true, data: randomMovie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------
// GET /api/movies/popular - Get most POPULAR movies (top 5)
// ----------------------------------------------------------
export const getPopularMovies = async (req, res) => {
  try {
    // Sort by popularity (most saved/watched) and get top 5
    const popularMovies = await Movie.find()
      .sort({ popularity: -1 })
      .limit(5);

    res.json({ success: true, count: popularMovies.length, data: popularMovies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------
// PUT /api/movies/:imdbID/rate - Rate a movie (1 to 5 stars)
// ----------------------------------------------------------
export const rateMovie = async (req, res) => {
  try {
    const { rating } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const movie = await Movie.findOne({ imdbID: req.params.imdbID });

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    // Calculate new average rating
    const totalRating = movie.rating * movie.ratingCount + rating;
    movie.ratingCount += 1;
    movie.rating = Math.round((totalRating / movie.ratingCount) * 10) / 10;

    await movie.save();

    res.json({ success: true, message: "Rating saved!", data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

