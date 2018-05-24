module.exports = function (app, Habit) {

    // GET route for retrieving all habits
    app.get("/api/goals/habit/:id", function (req, res) {
        var user = req.params.id;
        Habit.findAll({
            where: {
                UserId: user
            }
        }).then(function (result) {
            res.json(result);
        });
    });

    // POST route for creating a new task
    app.post("/api/goals/habit", function (req, res) {
        Habit.create(req.body).then(function (result) {
            res.json(result);
        });
    });

    // PUT route for update
    app.put("/api/goals/habit/id/:id", function (req, res) {
        Habit.update(
            req.body,
            {where: { id: req.params.id}
        })
            .then(function (result) {
                res.json(result);
            });
    });

}