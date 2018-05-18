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
    
    var habits = ["coding", "running", "reading", "machine learning"];
    var daysInMay = 31;

    // Generate a sadha-square
    function makeSadha() {
        for (var i = 0; i < habits.length; i++) {
            var goal = $("<div>");
            goal.attr("id", habits[i]);
            $("#sadha-squares").append(goal);
            for (var j = 0; j < daysInMay; j++) {
                var sadhaSquare = $("<div>");
                sadhaSquare.addClass("square");
                $("#sadha-squares").append(sadhaSquare);
            }
        }
    }

    makeSadha();

});