// Dependencies
// =============================================================
var express = require("express");
var router = express.Router();
// TODO: link models

// Routes
// =============================================================

module.exports = function(router, passport, User, utils) {
    // Landing Page
    router.get("/", function(req, res) {
        res.render("index");
    });

    // Log In
    router.get("/log_in", function(req, res) {
        res.render("login");
    });

    // Dashboard
    router.get("/dashboard", isLoggedIn, function(req, res) {
        res.render("dashboard", { layout: 'user' });
    });

    // Log Out
    router.get("/log_out", function(req, res) {
        req.session.destroy(function(err) {
            res.redirect("/");
        });
    });

    // Post route for signup
    router.post("/signup", passport.authenticate("local-signup", {
        successRedirect: "/dashboard",
        failureRedirect: "/"
    }));

    // Post route for login (non-Remember Me)
    // router.post("/log_in", passport.authenticate("local-signin", {
    //     successRedirect: "/dashboard",
    //     failureRedirect: "/log_in"
    // }));

    // Post route for login (Remember Me)
    router.post("/log_in", passport.authenticate("remember-me", {
        // successRedirect: "/dashboard",
        failureRedirect: "/log_in"
    }),
    function(req, res, next) {
        // Issue a remember me cookie if the option was checked
        if (!req.body.rememberme) {
            return next();
        }
        issueToken(req.user, function(err, token) {
            if (err) {
                return next(err);
            }
            res.cookie("remember-me", token, { path: "/", httpOnly: true, maxAge: 604800000 });
            return next();
        });
    },
    function(req, res) {
        res.redirect("/dashboard");
    });

    function issueToken(user, done) {
        var token = utils.randomString(64);
        saveRememberMeToken(token, user.id, function (err) {
            if (err) { return done(err); }
            return done(null, token);
        });
    };

    // var tokens = {};

    function consumeRememberMeToken(token, fn) {
        var uid = tokens[token];
        // invalidate the single-use token
        delete tokens[token];
        return fn(null, uid);
    };

    function saveRememberMeToken(token, uid, fn) {
        tokens[token] = uid;
        return fn();
    };

    // Function to verify the user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect("/log_in");
        }
    };

    // Pomodoro Timer
    router.get("/dashboard/pomodoro", isLoggedIn, function(req, res){
      res.render("pomodoro", {layout: 'user'});
    });
  
    // Add goal page
    // router.get("/dashboard/goal", isLoggedIn, function(req, res) {
    //   res.render("goal", {layout: 'user'});
    // });

    // Query DB for user info by email
    router.get("/api/user/:email", function(req, res) {
        User.findOne({
            where: {
                email: req.params.email
            }
        }).then(function(result) {
            res.json(result);
        });
    });
};
