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
    var tasks;

    function getTasks() {
        $.get("/api/tasks", function(data) {
            console.log("Tasks", data);
            tasks = data;
            initializeRows();
        })
    }

    function initializeRows() {
        taskContainer.empty();
        var tasksToAdd = [];
        for (var i = 0; i < tasks.length; i++) {
            tasksToAdd.push(createNewRow(tasks[i]));
        }
        taskContainer.append(tasksToAdd)
    }

    function createNewRow(task) {
        var newTaskCard = $("<div>");
        var deleteBtn = $("<button>");
        deleteBtn.text("x");
        deleteBtn.addClass("delete btn btn-danger");
        var deferBtn = $("<button>");
        deferBtn.text(">");
        deferBtn.addClass("btn btn-primary");
        var newTaskName = $("<h5>");
        newTaskName.text(task.task);
        newTaskCard.append(deleteBtn);
        newTaskCard.append(deferBtn);
        newTaskCard.append(newTaskName);
        return newTaskCard;
    }

    getTasks();

    // Button jQuery for AJAX POST request, cannot use with res.redirect
    // $("#sign-up").on("click", function(event) {
    //     event.preventDefault();
    //     // Capture user input
    //     var newUser = {
    //         firstname: $("#firstname").val().trim(),
    //         lastname: $("#lastname").val().trim(),
    //         username: $("#username").val().trim(),
    //         email: $("#email").val().trim(),
    //         password: $("#password").val().trim()
    //     };
    //     // Send the POST request
    //     $.post("/signup", newUser).then(function(data) {
    //         console.log("POST request successful\n" + data);
    //         // Corresponds to AJAX redirect in post-route.js
    //         if (data.status === "success") {
    //             window.location.replace(data.redirect);
    //         }
    //     });
    // });
});
