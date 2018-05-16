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

// About Page
router.get("/about", function(req, res) {
    res.render("about");
});

// How It Works Page
router.get("/tour", function(req, res) {
    res.render("tour");
});
// Dashboard
router.get("/dashboard", function(req, res) {
    res.render("dashboard");
});

// Pomodoro Timer

module.exports = router;