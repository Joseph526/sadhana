module.exports = function (sequelize, Sequelize) {
    var Habit = sequelize.define("Habit", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        habit: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        monday: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        tuesday: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        wednesday: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        thursday: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        friday: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        saturday: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        sunday: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    });

    Habit.associate = function (models) {
        Habit.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Habit
};
