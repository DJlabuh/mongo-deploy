ʼconst express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const baseRoutes = require("../routes/base-routes"); // Підключення базових маршрутів
const movieRoutes = require("../routes/movie-routes"); // Підключення маршрутів для фільмів

dotenv.config(); // Завантажуємо змінні середовища

const app = express();
const PORT = process.env.PORT || 3000;  // Від Vercel буде надано port через process.env.PORT
const URL = process.env.MONGO_URI; // Підключення до MongoDB з .env файлу

// Middleware для обробки JSON
app.use(express.json());

// Використання базових маршрутів
app.use("/", baseRoutes); // Базовий маршрут на кореневу адресу '/'

// Використання маршрутів для фільмів
app.use("/movies", movieRoutes); // Усі маршрути для фільмів починаються з '/movies'

mongoose
  .connect(URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to database:", err.message));

app.listen(PORT, () => {
  // Виводити лог тільки локально, на Vercel сервер автоматично запускається
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server is running on http://localhost:${PORT}`);
  }
});