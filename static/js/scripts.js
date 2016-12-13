(function($) {
    var socket;

    function initialize() {
        socket = io();

        socket.on("pressure", function(value, message) {
            console.log(arguments);
        });
    }

    $(initialize);
})($);