import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    imdbID: {
      type: String,
      required: true,
      unique: true, 
    },
    Title: {
      type: String,
      required: true,
    },
    Year: {
      type: String,
    },
    Type: {
      type: String,
    },
    Poster: {
      type: String,
    },
    // How many times users have saved/watched this movie
    popularity: {
      type: Number,
      default: 1,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Create the Movie model from the schema
const Movie = mongoose.model("Movie", movieSchema);

export default Movie;

