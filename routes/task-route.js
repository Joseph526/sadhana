module.exports = function (app, Task) {

    // GET all tasks
    app.get("/api/tasks/todo", function (req, res) {
        Task.findAll({}).then(function(result) {
            res.json(result);
        })
    })

    // // POST a new task

}