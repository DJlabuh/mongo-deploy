const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

dotenv.config();

const app = express();
const URL = process.env.MONGO_URI;

// Завантаження Swagger документації
const swaggerDocument = YAML.load(path.join(__dirname, "../public/swagger.yaml"));

// Middleware для JSON
app.use(express.json());

// Додаємо статичну папку
app.use(express.static(path.join(__dirname, "../public")));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ваші маршрути
app.use("/movies", require("../routes/movie-routes"));

// Підключення до MongoDB
mongoose
  .connect(URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to database:", err.message));

// Експортуємо для Vercel
module.exports = app;