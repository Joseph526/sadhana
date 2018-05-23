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



    var habits = ["coding", "running", "reading", "machine-learning"];
    var daysInMay = 31;

    // Generate a sadha-square
    function makeSadha() {
        for (var i = 0; i < habits.length; i++) {
            var goal = $("<div>");
            goal.attr("id", habits[i]);
            goal.addClass("habit");
            goal.append("<p>" + habits[i]);
            $("#sadha-squares").append(goal);
            for (var j = 0; j < daysInMay; j++) {
                var sadhaSquare = $("<div>");
                sadhaSquare.addClass("square");
                sadhaSquare.attr("id", habits[i] + "-" + (j+1));
                $("#" + habits[i]).append(sadhaSquare);
            }
        }
    };

    makeSadha();

    // TASKS

    var taskContainer = $(".task-container");
    var completedTaskContainer = $(".completed-task-container");
    var tasks;

    var taskInput = $("#task-input");

    // Get Today's tasks!
    function getTasks() {
        $.get("/api/tasks/todo/" + sessionStorage.getItem("id"), function (data) {
            console.log("Tasks", data);
            tasks = data;
            initializeRows();
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
            console.log("Tasks", data);
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
        var newTaskCard = $("<h5>");
        var newTaskName = $("<li>");
        newTaskName.text(task.task);
        newTaskCard.append(newTaskName);
        newTaskCard.addClass("complete-task")
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
        if (habits.includes(currentTask.task)) {
            habitsCommit.push(currentTask.task + "-" + moment().format('D'));
            // $("#" + currentTask.task + "-" + moment().format('D')).addClass("commit-square");
        }

        makeCommitSquares();

        var checkOffTask = {
            complete: true
        };

        $.ajax("api/tasks/todo/id/" + id, {
            type: "PUT",
            data: checkOffTask
        }).then(function () {
            console.log("You completed this task!");
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
        console.log(tomorrow);

        var deferTaskToTommorow = {
            due: tomorrow
        };

        $.ajax("api/tasks/todo/id/" + id, {
            type: "PUT",
            data: deferTaskToTommorow
        }).then(function() {
            console.log("You put it off to tomorrow");
            getTasks();
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
    
});
