$(document).ready(function () {

    console.log("I'm connected");

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
    $("#sign-up").on("click", function(event) {
        // Capture user input
        var newUser = {
            firstname: $("#firstname").val().trim(),
            lastname: $("#lastname").val().trim(),
            email: $("#email").val().trim(),
        };
        // Clear sessionStorage
        sessionStorage.clear();
        // Store all content into sessionStorage
        sessionStorage.setItem("firstname", newUser.firstname);
        sessionStorage.setItem("lastname", newUser.lastname);
        sessionStorage.setItem("email", newUser.email);

    //     // Send the POST request
    //     $.post("/signup", newUser).then(function(data) {
    //         console.log("POST request successful\n" + data);
    //         // Corresponds to AJAX redirect in post-route.js
    //         if (data.status === "success") {
    //             window.location.replace(data.redirect);
    //         }
    //     });
    });

    $("#log-in").on("click", function(event) {
        // Capture user input
        var existingUser = {
            email: $("#email").val().trim()
        };
        // Query DB
        $.get("/api/" + existingUser.email, function(data) {
            // Clear sessionStorage
            sessionStorage.clear();
            // Store all content into sessionStorage
            sessionStorage.setItem("firstname", data.firstname);
            sessionStorage.setItem("lastname", newUser.lastname);
            sessionStorage.setItem("email", newUser.email);
        });
    });

    $("#userName").text(sessionStorage.getItem("firstname"));
});
