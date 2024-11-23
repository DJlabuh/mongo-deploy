const express = require("express");
const router = express.Router();

// Базовий маршрут
router.get("/", (req, res) => {
  res.send("Welcome to the MovieBox API");
});

module.exports = router;
