const express = require("express");
const {
  getMovies,
  getMovie,
  deleteMovie,
  addMovie,
  updateMovie,
} = require("../controllers/movie-controllers");

const router = express.Router();

router.get("/movies", getMovies); // Маршрут для отримання списку фільмів
router.get("/movies/:id", getMovie); // Маршрут для отримання одного фільму за id
router.delete("/movies/:id", deleteMovie); // Маршрут для видалення фільму за його id
router.post("/movies", addMovie); // Маршрут для додавання фільму
router.patch("/movies/:id", updateMovie); // Маршрут оновлення фільму за ID

module.exports = router;
