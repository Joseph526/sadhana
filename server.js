// Dependencies
// =============================================================
var express = require("express");
var passport = require("passport");
var session = require("express-session");
var bodyParser = require("body-parser");
var env = require("dotenv").load();
var exphbs = require("express-handlebars");

var app = express();
var PORT = process.env.PORT || 3000;

// Sequelize models
var db = require("./models");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// For Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
require("./routes/post-route.js")(app, passport, db.User);
require("./routes/task-route.js")(app, db.Task);


// app.use(routes);

// load passport strategies
require("./config/passport/passport.js")(passport, db.User);

// Sync sequelize models and start server:

db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});