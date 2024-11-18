const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');

const PORT = 3000;
const app = express();

let db;

// Підключення до бази даних
connectToDb((err) => {
  if (!err) {
    db = getDb();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } else {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  }
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
  if (!db) {
    return handleError(res, 'Database connection not established');
  }
  res.send('Welcome to the MovieBox API');
});

// Маршрут для отримання списку фільмів
app.get('/movies', (req, res) => {
  const movies = [];
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  
  db.collection('movies')
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ title: 1 })
    .forEach((movie) => movies.push(movie))
    .then(() => res.status(200).json(movies))
    .catch(() => handleError(res, 'Something goes wrong...'));
});

// Маршрут для отримання одного фільму за id
app.get('/movies/:id', (req, res) => {
  const movieId = req.params.id;

  if (ObjectId.isValid(movieId)) {
    db.collection('movies')
      .findOne({ _id: new ObjectId(movieId) })
      .then((doc) => {
        if (doc) {
          res.status(200).json(doc);
        } else {
          handleError(res, 'Movie not found', 404);
        }
      })
      .catch(() => handleError(res, 'Something goes wrong...'));
  } else {
    handleClientError(res, 'Invalid movie id');
  }
});

// Маршрут для видалення фільму за його id
app.delete('/movies/:id', (req, res) => {
  const movieId = req.params.id;

  if (ObjectId.isValid(movieId)) {
    db.collection('movies')
      .deleteOne({ _id: new ObjectId(movieId) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.status(200).json({ message: 'Movie deleted successfully' });
        } else {
          handleError(res, 'Movie not found', 404);
        }
      })
      .catch(() => handleError(res, 'Something goes wrong...'));
  } else {
    handleClientError(res, 'Invalid movie id');
  }
});