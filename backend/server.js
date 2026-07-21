import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import movieRoutes from "./routes/movieRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "🎬 MovieSpace API is running!",
    endpoints: {
      getAllMovies: "GET    /api/movies",
      saveMovie: "POST   /api/movies",
      deleteMovie: "DELETE /api/movies/:imdbID",
      recommend: "GET    /api/movies/recommend",
      popular: "GET    /api/movies/popular",
      rateMovie: "PUT    /api/movies/:imdbID/rate",
    },
  });
});

// Use movie routes
app.use("/api/movies", movieRoutes);


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

