const Movie = require("../models/movie");

// Функція обробки помилок
const handleError = (res, err, status = 500) => {
  console.error(err);  // Логування повної помилки на сервері (для розробника)
  res.status(status).json({ error: err.message || "Something goes wrong..." }); // Відправка лише повідомлення про помилку користувачу
};

const getMovies = (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

  Movie.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ title: 1 })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

const getMovie = (req, res) => {
  const movieId = req.params.id;

  Movie.findById(movieId)
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie);
      } else {
        handleError(res, new Error("Movie not found"), 404);
      }
    })
    .catch((err) => handleError(res, err));
};

const deleteMovie = (req, res) => {
  const movieId = req.params.id;

  Movie.findByIdAndDelete(movieId)
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Movie deleted successfully" });
      } else {
        handleError(res, new Error("Movie not found"), 404);
      }
    })
    .catch((err) => handleError(res, err));
};

const addMovie = (req, res) => {
  const movie = new Movie(req.body);

  movie
    .save()
    .then((savedMovie) => {
      res
        .status(201)
        .json({ message: "Movie added successfully", movieId: savedMovie._id });
    })
    .catch((err) => handleError(res, err));
};

const updateMovie = (req, res) => {
  const movieId = req.params.id;

  Movie.findByIdAndUpdate(movieId, req.body, { new: true }) // Параметр 'new' повертає новий об'єкт
    .then((updatedMovie) => {
      if (updatedMovie) {
        res
          .status(200)
          .json({ message: "Movie updated successfully", movie: updatedMovie });
      } else {
        handleError(res, new Error("Movie not found"), 404);
      }
    })
    .catch((err) => handleError(res, err));
};

module.exports = {
  getMovies,
  getMovie,
  deleteMovie,
  addMovie,
  updateMovie,
};