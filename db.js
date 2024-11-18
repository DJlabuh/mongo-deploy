const { MongoClient } = require('mongodb');
require('dotenv').config(); // Для використання змінних середовища

const URL = process.env.MONGO_URI || 'mongodb://localhost:27017/moviebox';

let dbConnection;

module.exports = {
  // Метод для підключення до бази даних
  connectToDb: (cb) => {
    MongoClient
      .connect(URL)
      .then((client) => {
        console.log('Connected to MongoDB');
        dbConnection = client.db(); // Збереження підключення до бази
        cb(); // Виклик callback після успішного підключення
      })
      .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        cb(err); // Повернення помилки через callback
      });
  },
  // Метод для отримання екземпляра підключення до бази
  getDb: () => {
    if (!dbConnection) {
      throw new Error('Database not initialized. Call connectToDb first.');
    }
    return dbConnection;
  },
};