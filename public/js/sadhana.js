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
            // TODO: make sure due = today
            if (!tasks[i].complete && moment(tasks[i].due).format('l') === moment().format('l')) {
                tasksToAdd.push(createNewRow(tasks[i]));
            }
        }
        taskContainer.append(tasksToAdd)
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
                tasksToAdd.push(createNewRow(tasks[i]));
            }
        }
        completedTaskContainer.append(tasksToAdd)
    }

    function createNewRow(task) {
        var newTaskCard = $("<div>");
        var completeBtn = $("<button>");
        completeBtn.text("x");
        completeBtn.addClass("complete btn btn-danger");
        var deferBtn = $("<button>");
        deferBtn.text(">");
        deferBtn.addClass("defer btn btn-primary");
        var newTaskName = $("<h5>");
        newTaskName.text(task.task);
        newTaskCard.append(completeBtn);
        newTaskCard.append(deferBtn);
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
    $(document).on("click", "button.complete", handleTaskComplete);

    function handleTaskComplete() {
        var currentTask = $(this)
            .parent()
            .data("task");

        var id = currentTask.id;

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

});
