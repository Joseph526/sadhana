// Dependencies
// =============================================================
var express = require("express");
var router = express.Router();
// TODO: link models

// Routes
// =============================================================
// module.exports = function(app) {

//   app.get("/", function(req, res) {
//     res.render("index");
//   });

// };

router.get("/", function(req, res) {
    res.render("index");
});

module.exports = router;