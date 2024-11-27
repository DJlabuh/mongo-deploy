const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();
const URL = process.env.MONGO_URI;

// Інлайн Swagger документація
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "MovieBox API",
    description: "API for managing movies.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://mongo-deploy-nu.vercel.app", // Замініть на вашу Vercel URL
    },
  ],
  paths: {
    "/movies": {
      get: {
        summary: "Get all movies",
        responses: {
          200: {
            description: "A list of movies",
          },
        },
      },
    },
  },
};

// Middleware для JSON
app.use(express.json());

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