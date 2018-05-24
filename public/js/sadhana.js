$(document).ready(function () {

    console.log("I'm connected");

    // Moment.js Dates
    var today = moment().format('dddd, MMMM Do YYYY');
    var month = moment().format('MMMM');
    var monthAndYear = moment().format('MMMM YYYY');

    $("#today").append(today);
    $("#this-month").append(month);
    $("#this-month-and-year").append(monthAndYear);

    // Select all links with hashes
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top - 100
                    }, 600, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });

    // Button jQuery for user info save into sessionStorage
    $("#sign-up, #log-in").on("click", function (event) {
        // Capture user input
        var saveUser = {
            email: $("#email").val().trim()
        };
        // Clear sessionStorage and save user email
        sessionStorage.clear();
        sessionStorage.setItem("email", saveUser.email);
    });

    // TASKS

    var taskContainer = $(".task-container");
    var completedTaskContainer = $(".completed-task-container");
    var tasks;

    var taskInput = $("#task-input");

    // Get Today's tasks!
    function getTasks() {
        $.get("/api/tasks/todo/" + sessionStorage.getItem("id"), function (data) {
            // console.log("Tasks", data);
            tasks = data;
            initializeRows();

            var todaysTasksArray = [];
            for (var i = 0; i < tasks.length; i ++) {
                console.log(moment(tasks[i].due).format('dddd'));
                console.log(moment().format('dddd'));
                if (moment(tasks[i].due).format('dddd') === moment().format('dddd')) {
                    todaysTasksArray.push(tasks[i].task);
                }
            }
            console.log("tasks array: " + todaysTasksArray);
            console.log("habits array: " + todaysHabitsArray);

            for (var j = 0; j < todaysHabitsArray.length; j++) {
                // TODO: this doesn't allow user to defer a habit-generated task
                if (!todaysTasksArray.includes(todaysHabitsArray[j])) {
                    console.log(todaysHabitsArray[j]);
                    prependTask({
                        task: todaysHabitsArray[j],
                        UserId: sessionStorage.getItem("id")
                    });
                }
            }
        })
    }

    function initializeRows() {
        taskContainer.empty();
        var tasksToAdd = [];
        for (var i = 0; i < tasks.length; i++) {
            if (!tasks[i].complete && moment(tasks[i].due).format('l') === moment().format('l')) {
                tasksToAdd.push(createNewRow(tasks[i]));
            }
        }
        taskContainer.append(tasksToAdd)
    }

    function createNewRow(task) {
        var newTaskCard = $("<li>");
        var completeBtn = $("<button>");
        completeBtn.html("<i class='fas fa-times'></i>");
        completeBtn.addClass("complete btn");
        var deferBtn = $("<button>");
        deferBtn.html("<i class='fas fa-angle-right'></i>");
        deferBtn.addClass("defer btn");
        var newTaskName = $("<h5>");
        newTaskName.text(task.task);
        newTaskCard.append(completeBtn);
        newTaskCard.append(deferBtn);
        newTaskCard.append(newTaskName);
        newTaskCard.data("task", task);
        return newTaskCard;
    }

    // Get Today's completed tasks!
    function getCompletedTasks() {
        $.get("/api/tasks/todo/" + sessionStorage.getItem("id"), function (data) {
            // console.log("Tasks", data);
            tasks = data;
            initializeCompletedRows();
        })
    }

    function initializeCompletedRows() {
        completedTaskContainer.empty();
        var tasksToAdd = [];
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].complete && moment(tasks[i].due).format('l') === moment().format('l')) {
                tasksToAdd.push(createCompletedRow(tasks[i]));
            }
        }
        completedTaskContainer.append(tasksToAdd)
    }

    function createCompletedRow(task) {
        var newTaskCard = $("<li>");
        var addBtn = $("<button>");
        addBtn.html("<i class='fas fa-plus'></i>");
        addBtn.addClass("add btn");
        var newTaskName = $("<h5>");
        newTaskName.text(task.task);
        newTaskCard.append(addBtn);
        newTaskCard.append(newTaskName);
        newTaskCard.data("task", task);
        return newTaskCard;
    }

    // CREATE a new task
    $(document).on("submit", "#add-task", newTask)

    function newTask(event) {
        event.preventDefault();
        if (!taskInput.val().trim()) {
            return;
        }

        prependTask({
            task: taskInput
                .val()
                .trim(),
            UserId: sessionStorage.getItem("id")
        });

        taskInput.val('');
    };

    function prependTask(taskData) {
        $.post("/api/tasks/todo", taskData)
            .then(getTasks);
    }

    // COMPLETE a task
    var habitsCommit = [];

    $(document).on("click", "button.complete", handleTaskComplete);

    function handleTaskComplete() {
        var currentTask = $(this)
            .parent()
            .data("task");

        var id = currentTask.id;

        // THIS DOES NOT STAY AFTER REFRESH OR RE-LOG-IN!!!!!!!!!!!!
        // I think the solution involves creating a Habits table and pushing to a new array and looping through it
        // But I don't want to work on that right now :-/
        if (goalArray.includes(currentTask.task)) {
            habitsCommit.push(currentTask.task + "-" + moment().format('D'));
        }

        makeCommitSquares();

        var checkOffTask = {
            complete: true,
            completedAt: moment().format()
        };

        $.ajax("api/tasks/todo/id/" + id, {
            type: "PUT",
            data: checkOffTask
        }).then(function () {
            // console.log("You completed this task!");
            getTasks();
            getCompletedTasks();
        })
    }

    // DEFER A TASK
    $(document).on("click", "button.defer", handleTaskDefer);

    function handleTaskDefer() {

        var currentTask = $(this)
            .parent()
            .data("task");

        var id = currentTask.id;
        var tomorrow = moment().add(1, 'day').format();
        // console.log(tomorrow);

        var deferTaskToTommorow = {
            due: tomorrow
        };

        $.ajax("api/tasks/todo/id/" + id, {
            type: "PUT",
            data: deferTaskToTommorow
        }).then(function () {
            // console.log("You put it off to tomorrow");
            getTasks();
        })
    }

    // RE-ADD a task
    $(document).on("click", "button.add", handleTaskAdd);

    function handleTaskAdd() {
        var currentTask = $(this)
            .parent()
            .data("task");

        var id = currentTask.id;

        var addBackTask = {
            complete: false,
            completedAt: null
        };

        $.ajax("api/tasks/todo/id/" + id, {
            type: "PUT",
            data: addBackTask
        }).then(function () {
            // console.log("You completed this task!");
            getTasks();
            getCompletedTasks();
        })
    }


    getTasks();
    getCompletedTasks();

    function makeCommitSquares() {
        for (var i = 0; i < habitsCommit.length; i++) {
            $("#" + habitsCommit[i]).addClass("commit-square");
        }
    }

    // makeCommitSquares();


    // Short timeout to fix async bug on page load
    setTimeout(getTasks, 100);

    // HABITS

    // CREATE a new goal
    $(document).on("submit", "#add-goal", newGoal)

    var goalInput = $("#goal-input")

    function newGoal(event) {
        event.preventDefault();
        if (!goalInput.val().trim()) {
            return;
        }

        prependGoal({
            habit: goalInput
                .val()
                .trim(),
            monday: $("input[name=Monday]").is(":checked"),
            tuesday: $("input[name=Tuesday]").is(":checked"),
            wednesday: $("input[name=Wednesday]").is(":checked"),
            thursday: $("input[name=Thursday]").is(":checked"),
            friday: $("input[name=Friday]").is(":checked"),
            saturday: $("input[name=Saturday]").is(":checked"),
            sunday: $("input[name=Sunday]").is(":checked"),
            UserId: sessionStorage.getItem("id")
        });

        goalInput.val('');
    };

    function prependGoal(goalData) {
        $.post("/api/goals/habit", goalData)
            .then(getGoals);

    }

    var goalContainer = $(".goal-container");
    var goals;
    var todaysHabitsArray = [];
    var todaysTasksArray;

    function getGoals() {
        $.get("/api/goals/habit/" + sessionStorage.getItem("id"), function (data) {
            // console.log("Goals", data);
            goals = data;
            initializeGoalRows();
            makeGoalMap();

            // var todaysHabitsArray = [];
            for (var i = 0; i < goals.length; i ++) {
                if (goals[i].wednesday && moment().format('dddd') === "Wednesday" && !todaysHabitsArray.includes(goals[i].habit)) {
                    todaysHabitsArray.push(goals[i].habit);
                }
            }
            // console.log(todaysHabitsArray);
            // return todaysHabitsArray;
        })
    }

    function initializeGoalRows() {
        goalContainer.empty();
        var goalsToAdd = [];
        for (var i = 0; i < goals.length; i++) {
            goalsToAdd.push(createNewGoalRow(goals[i]));
            // goalsToAdd.push(goals[i].habit);
        }
        goalContainer.append(goalsToAdd);
        // console.log(goalsToAdd);
    }

    function createNewGoalRow(goal) {
        var newGoalCard = $("<li>");
        var newGoalName = $("<h5>");
        newGoalName.text(goal.habit);

        newGoalCard.append(newGoalName);

        if (goal.monday) {
            var monday = $("<div>");
            monday.text("Monday");
            newGoalCard.append(monday);
        }

        if (goal.tuesday) {
            var tuesday = $("<div>");
            tuesday.text("Tuesday");
            newGoalCard.append(tuesday);
        }

        if (goal.wednesday) {
            var wednesday = $("<div>");
            wednesday.text("Wednesday");
            newGoalCard.append(wednesday);
        }
        if (goal.thursday) {
            var thursday = $("<div>");
            thursday.text("Thursday");
            newGoalCard.append(thursday);
        }

        if (goal.friday) {
            var friday = $("<div>");
            friday.text("Friday");
            newGoalCard.append(friday);
        }

        if (goal.saturday) {
            var saturday = $("<div>");
            saturday.text("Saturday");
            newGoalCard.append(saturday);
        }

        if (goal.sunday) {
            var sunday = $("<div>");
            sunday.text("Sunday");
            newGoalCard.append(sunday);
        }

        newGoalCard.data("goal", goals);

        return newGoalCard;
    }

    getGoals();

    var goalArray = [];
    // var daysInMay = 31;
    var daysInMonth = moment().daysInMonth();

    function makeGoalMap() {
        // var goalArray = [];
        for (var i = 0; i < goals.length; i++) {
            goalArray.push(goals[i].habit);
        };
        // console.log(goalArray);

        makeSadha();
    };

    //  Generate a sadha-square
    function makeSadha() {
        // console.log(goalArray);
        for (var i = 0; i < goalArray.length; i++) {
            var goal = $("<div>");
            goal.attr("id", goalArray[i]);
            goal.addClass("habit");
            goal.append("<p>" + goalArray[i]);
            $("#sadha-squares").append(goal);
            for (var j = 0; j < daysInMonth; j++) {
                var sadhaSquare = $("<div>");
                sadhaSquare.addClass("square");
                sadhaSquare.attr("id", goalArray[i] + "-" + (j + 1));
                $("#" + goalArray[i]).append(sadhaSquare);
            }
        }
    };
});
