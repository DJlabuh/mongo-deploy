const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

require('dotenv').config(); // Для використання змінних середовища

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

let db;

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

// Маршрут для додавання фільму
app.post('/movies', (req, res) => {
  db.collection('movies')
    .insertOne(req.body)
    .then((result) => {
      if (result.insertedId) {
        res.status(201).json({ message: 'Movie added successfully', movieId: result.insertedId });
      } else {
        handleError(res, 'Failed to add movie');
      }
    })
    .catch(() => handleError(res, 'Something goes wrong...'));
});

//Маршрут оновлення фільму за ID
app.patch('/movies/:id', (req, res) => {
  const movieId = req.params.id;

  if (ObjectId.isValid(movieId)) {
    db.collection('movies')
      .updateOne({ _id: new ObjectId(movieId) }, { $set: req.body })
      .then((result) => {
        if (result.matchedCount > 0) {
          if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Movie updated successfully' });
          } else {
            res.status(200).json({ message: 'No changes were made to the movie' });
          }
        } else {
          handleError(res, 'Movie not found', 404);
        }
      })
      .catch(() => handleError(res, 'Something goes wrong...'));
  } else {
    handleClientError(res, 'Invalid movie id');
  }
});