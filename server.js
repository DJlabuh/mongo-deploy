const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./models/movie');

require('dotenv').config(); // Імпортуємо dotenv

const PORT = 3000;
const app = express();
const URL = process.env.MONGO_URI || 'mongodb://localhost:27017/moviebox';

// Middleware для обробки JSON
app.use(express.json());  

mongoose
  .connect(URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to database:', err.message))

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Функції обробки помилок
const handleError = (res, error, status = 500) => {
  res.status(status).json({ error });
};

const handleClientError = (res, error) => {
  res.status(400).json({ error });
};

// Базовий маршрут
app.get('/', (req, res) => {
  res.send('Welcome to the MovieBox API');
});

// Маршрут для отримання списку фільмів
app.get('/movies', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);  
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  
  Movie.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ title: 1 })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch(() => {
      handleError(res, 'Something goes wrong...');
    });
});

// Маршрут для отримання одного фільму за id
app.get('/movies/:id', (req, res) => {
  const movieId = req.params.id;

    Movie
      .findById( movieId )
      .then((movie) => {
        if (movie) {
          res.status(200).json(movie);
        } else {
          handleError(res, 'Movie not found', 404);
        }
      })
      .catch(() => handleError(res, 'Something goes wrong...'));
});

// Маршрут для видалення фільму за його id
app.delete('/movies/:id', (req, res) => {
  const movieId = req.params.id;

  Movie
    .findByIdAndDelete(movieId)
    .then((movie) => {
      if (movie) {
        res.status(200).json({ message: 'Movie deleted successfully' });
      } else {
        handleError(res, 'Movie not found', 404);
      }
    })
    .catch(() => handleError(res, 'Something goes wrong...'));
});

// Маршрут для додавання фільму
app.post('/movies', (req, res) => {
  const movie = new Movie(req.body);

  movie
    .save()
    .then((savedMovie) => {
      res.status(201).json({ message: 'Movie added successfully', movieId: savedMovie._id });
    })
    .catch(() => handleError(res, 'Something goes wrong...'));
});

// Маршрут оновлення фільму за ID
app.patch('/movies/:id', (req, res) => {
  const movieId = req.params.id;

  Movie
    .findByIdAndUpdate(movieId, req.body, { new: true })  // Параметр 'new' повертає новий об'єкт
    .then((updatedMovie) => {
      if (updatedMovie) {
        res.status(200).json({ message: 'Movie updated successfully', movie: updatedMovie });
      } else {
        handleError(res, 'Movie not found', 404);
      }
    })
    .catch(() => handleError(res, 'Something goes wrong...'));
});