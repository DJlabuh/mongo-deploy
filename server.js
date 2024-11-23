const express = require("express");
const mongoose = require("mongoose");
const baseRoutes = require("./routes/base-routes");
const movieRoutes = require("./routes/movie-routes");

require("dotenv").config(); // Імпортуємо dotenv

const PORT = 3000;
const app = express();
const URL = process.env.MONGO_URI || "mongodb://localhost:27017/moviebox";

// Middleware для обробки JSON
app.use(express.json());

// Використання базових маршрутів
app.use(baseRoutes); // Базовий маршрут '/'

// Використання маршрутів для фільмів
app.use("/movies", movieRoutes);

mongoose
  .connect(URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to database:", err.message));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
