// Dependencies
// =============================================================
var express = require("express");
var router = express.Router();
// TODO: link models

// Routes
// =============================================================

// Landing Page
router.get("/", function(req, res) {
    res.render("index");
});

// Log In
router.get("/log_in", function(req, res) {
    res.render("login");
});

// Dashboard
router.get("/dashboard", function(req, res) {
    res.render("dashboard", {layout: 'user'});
});

// Pomodoro Timer

// Dashboard
router.get("/goal", function(req, res) {
    res.render("goal", {layout: 'user'});
});

module.exports = router;