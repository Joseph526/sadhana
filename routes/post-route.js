// Dependencies
// =============================================================
var path = require("path");

var lunches = [
    {
      lunch: "Beet & Goat Cheese Salad with minestrone soup."
    }, {
      lunch: "Pizza, two double veggie burgers, fries with a Big Gulp"
    }
  ];

// Routes
// =============================================================
module.exports = function(app) {

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/test.html"));
  });

  app.get("/weekday", function(req, res) {
    res.render("index");
  });

};