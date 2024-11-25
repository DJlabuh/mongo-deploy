const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const baseRoutes = require("../routes/base-routes"); // Змінити на 'routes/base-routes'
const movieRoutes = require("../routes/movie-routes"); // Змінити на 'routes/movie-routes'

dotenv.config(); // Завантажуємо змінні середовища

const app = express();

const URL = process.env.MONGO_URI; // Підключення до MongoDB з .env файлу

// Завантаження Swagger документації
const swaggerDocument = YAML.load(path.join(__dirname, "../public/swagger.yaml")); // Виправлення шляху

// Middleware для обробки JSON
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Використання базових маршрутів
app.use("/", baseRoutes); // Базовий маршрут на кореневу адресу '/'

// Використання маршрутів для фільмів
app.use("/movies", movieRoutes); // Усі маршрути для фільмів починаються з '/movies'

// Підключення до MongoDB
mongoose
  .connect(URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to database:", err.message));

// Експортуємо додаток для використання на Vercel (Vercel самостійно запускає додаток)
module.exports = app;