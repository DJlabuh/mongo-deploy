const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genres: [String],
  rating: {
    type: Number,
    min: 0,
    max: 10,
  },
  duration: {
    hours: {
      type: Number,
      min: 0,
    },
    minutes: {
      type: Number,
      min: 0,
    }
  },
  reviews: [{
    name: String,
    text: String,
  }],
}, { timestamps: true }); // Додано timestamps для автоматичного створення полів createdAt та updatedAt

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;