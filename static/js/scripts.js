(function($) {
    var socket;

    function initialize() {
        socket = io();

        socket.on("led", function() {
            console.log("led event triggered");
        });
    }

    $(initialize);
})($);