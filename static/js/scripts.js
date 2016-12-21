app = (function ($) {
    var app = {
        createTimeline: function () {
            this.$window = $(window);
            this.$chart = $("#chart");
            this.temperatureData = new TimeSeries();
            this.lightData = new TimeSeries();

            this.chart = new SmoothieChart({
                yRangeFunction: function(range) {
                    return {
                        max: 100,
                        min: 0
                    }
                }
            });

            this.chart.addTimeSeries(this.temperatureData, {
                strokeStyle: 'rgba(0, 255, 0, 1)',
                fillStyle: 'rgba(0, 255, 0, 0.2)',
                lineWidth: 3
            });

            this.chart.addTimeSeries(this.lightData, {
                strokeStyle: 'rgba(0, 0, 255, 1)',
                fillStyle: 'rgba(0, 0, 255, 0.2)',
                lineWidth: 3
            });

            this.chart.streamTo(this.$chart[0], 500);

            this.socket.on("temperature", function (value) {
                this.temperatureData.append(new Date().getTime(), value);
            }.bind(this));

            this.socket.on("light", function (value) {
                this.lightData.append(new Date().getTime(), value * 100);
            }.bind(this));

            this.$window.on("resize", function() {
                this.$chart.attr("width", this.$chart.parent().width());
            }.bind(this));

            this.$chart.attr("width", this.$chart.parent().width());
            this.$chart.attr("height", 200);
        },

        initializeHealthBar: function () {
            this.$healthBar = $(".progress");
            this.$health = $("[data-health]");

            this.socket.on("health", function (value) {
                this.$health.text(value);
                this.$healthBar.attr("value", value);

                if (value >= 60) {
                    this.$healthBar.removeClass("progress-warning progress-danger").addClass("progress-success");
                } else if (value >= 30 && value < 60) {
                    this.$healthBar.removeClass("progress-danger progress-success").addClass("progress-warning");
                } else {
                    this.$healthBar.removeClass("progress-warning progress-success").addClass("progress-danger");
                }
            }.bind(this));
        },

        initialize: function () {
            this.socket = io();
            
            this.initializeHealthBar();
            this.createTimeline();
        }
    };

    $(function () {
        app.initialize();
    });

    return app;
})($);