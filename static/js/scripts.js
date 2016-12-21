(function($) {
    var socket;

    function initialize() {
        socket = io();

        var graphData = new TimeSeries();

        socket.on("pressure", function(value, message) {
            console.log(arguments);
            $('.progress-bar').css('width', arguments[0]+'%').attr('aria-valuenow', arguments[0]);
            graphData.append(new Date().getTime(), arguments[0]);
        });
        createTimeline();
        function createTimeline() {
            var chart = new SmoothieChart();
            chart.addTimeSeries(graphData, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
            chart.streamTo(document.getElementById("chart"), 500);
        }
    }

    $(initialize);
})($);