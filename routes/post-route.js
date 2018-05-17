// Dependencies
// =============================================================
var express = require("express");
var router = express.Router();
// TODO: link models

// Routes
// =============================================================

// Log In Page
router.get("/", function(req, res) {
    res.render("index");
});

// Dashboard
router.get("/dashboard", function(req, res) {
    res.render("dashboard");
});

// Pomodoro Timer

module.exports = router;