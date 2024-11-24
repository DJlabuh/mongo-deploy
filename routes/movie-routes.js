const express = require("express");
const {
  getMovies,
  getMovie,
  deleteMovie,
  addMovie,
  updateMovie,
} = require("../controllers/movie-controllers"); // Змінено шлях на "../controllers/movie-controllers"

const router = express.Router();

router.get("/", getMovies); // /movies для отримання списку фільмів
router.get("/:id", getMovie); // /movies/:id для отримання одного фільму за id
router.delete("/:id", deleteMovie); // /movies/:id для видалення фільму
router.post("/", addMovie); // /movies для додавання фільму
router.patch("/:id", updateMovie); // /movies/:id для оновлення фільму

module.exports = router;