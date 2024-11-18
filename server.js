const express = require('express');
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