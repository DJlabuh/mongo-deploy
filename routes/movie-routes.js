const express = require("express");
const {
  getMovies,
  getMovie,
  deleteMovie,
  addMovie,
  updateMovie,
} = require("../controllers/movie-controllers");

const router = express.Router();

router.get("/", getMovies); // Маршрут для отримання списку фільмів
router.get("/:id", getMovie); // Маршрут для отримання одного фільму за id
router.delete("/:id", deleteMovie); // Маршрут для видалення фільму за його id
router.post("/", addMovie); // Маршрут для додавання фільму
router.patch("/:id", updateMovie); // Маршрут оновлення фільму за ID

module.exports = router;