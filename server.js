const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');

const PORT = 3000;
const app = express();

let db;

// Підключення до бази даних
connectToDb((err) => {
  if (!err) {
    db = getDb(); // Отримання підключення
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } else {
    console.error('Failed to connect to database:', err.message);
    process.exit(1); // Завершити процес у разі помилки
  }
});

// Базовий маршрут
app.get('/', (req, res) => {
  if (!db) {
    return res.status(500).send('Database connection not established');
  }
  res.send('Welcome to the MovieBox API');
});

// Маршрут для отримання списку фільмів
app.get('/movies', (req, res) => {
  const movies = [];
  
  // Додаткові параметри пагінації (наприклад, page, limit)
  const { page = 1, limit = 10 } = req.query;
  
  db
    .collection('movies')
    .find()
    .skip((page - 1) * limit)  // Пропуск попередніх елементів
    .limit(parseInt(limit))    // Обмеження на кількість елементів
    .sort({ title: 1 })
    .forEach((movie) => movies.push(movie))
    .then(() => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error('Error fetching movies:', err);
      res.status(500).json({ error: "Something went wrong..." });
    });
});

// Маршрут для отримання одного фільму за id
app.get('/movies/:id', (req, res) => {
  const movieId = req.params.id;

  // Перевірка на валідність id
  if (ObjectId.isValid(movieId)) {
    db
      .collection('movies')
      .findOne({ _id: new ObjectId(movieId) })  // Преобразуем id в ObjectId
      .then((doc) => {
        if (doc) {
          res.status(200).json(doc);  // Если фильм найден
        } else {
          res.status(404).json({ error: "Movie not found" });  // Если фильм не найден
        }
      })
      .catch((err) => {
        console.error('Error fetching movie by id:', err);
        res.status(500).json({ error: "Something went wrong..." });
      });
  } else {
    res.status(400).json({ error: "Invalid movie id" });  // Код ошибки 400 для неправильного id
  }
});


// Маршрут для видалення фільму за його id.
app.delete('/movies/:id', (req, res) => {
  const movieId = req.params.id;

  // Перевірка на валідність id
  if (ObjectId.isValid(movieId)) {
    db
      .collection('movies')
      .deleteOne({ _id: new ObjectId(movieId) })  // Преобразуем id в ObjectId
      .then((result) => {
        if (result.deletedCount > 0) {
          res.status(200).json({ message: "Movie deleted successfully" });  // Фільм успішно видалений
        } else {
          res.status(404).json({ error: "Movie not found" });  // Якщо фільм не знайдений
        }
      })
      .catch((err) => {
        console.error('Error deleting movie:', err);
        res.status(500).json({ error: "Something went wrong..." });  // Помилка на сервері
      });
  } else {
    res.status(400).json({ error: "Invalid movie id" });  // Код помилки 400 для неправильного id
  }
});