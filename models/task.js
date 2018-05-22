module.exports = function (sequelize, Sequelize) {
    var Task = sequelize.define("Task", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        task: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        complete: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        due: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    });

    Task.associate = function (models) {
        Task.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Task
};
