module.exports = function (app, Task) {

    // GET route for retrieving all tasks
    app.get("/api/tasks/todo/:id", function (req, res) {
        var user = req.params.id;
        Task.findAll({
            where: {
                UserId: user
            }
        }).then(function(result) {
            res.json(result);
        });
    });

    // POST route for creating a new task
    app.post("/api/tasks/todo", function (req, res) {
        Task.create(req.body).then(function(result) {
            res.json(result);
        })
    })
}