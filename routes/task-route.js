var db = require("../models");

module.exports = function (app) {

    // GET all tasks
    app.get("/api/tasks", function (req, res) {
        db.Task.findAll({}).then(function(result) {
            res.json(result);
        })
    })

    // // POST a new task

}