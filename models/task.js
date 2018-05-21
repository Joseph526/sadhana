module.exports = function(sequelize, Sequelize) {
    var Task = sequelize.define("Task", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        task: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });

    return Task
}