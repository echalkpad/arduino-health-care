app = (function ($) {
    var app = {
        createTimeline: function () {
            this.$window = $(window);
            this.$chart = $("#chart");
            this.temperatureData = new TimeSeries();
            this.lightData = new TimeSeries();

            this.chart = new SmoothieChart({
                yRangeFunction: function (range) {
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
                this.$temperature.text(Math.round(value));
                this.temperatureData.append(new Date().getTime(), value);
            }.bind(this));

            this.socket.on("light", function (value) {
                if (value > 0.50) {
                    this.$light.text("good");
                } else if (value > 0.20) {
                    this.$light.text("moderate");
                } else {
                    this.$light.text("bad");
                }
                
                this.lightData.append(new Date().getTime(), value * 100);
            }.bind(this));

            this.$window.on("resize", function () {
                this.$chart.attr("width", this.$chart.parent().width());
            }.bind(this));

            this.$chart.attr("width", this.$chart.parent().width());
            this.$chart.attr("height", 200);
        },

        initializeHealthBar: function () {
            this.$healthBar = $(".progress");
            this.$health = $("[data-health]");
            this.$temperature = $("[data-temperature]");
            this.$light = $("[data-lightning]");
            this.$you = $("[data-you]");

            this.socket.on("health", function (value) {
                this.$health.text(value);
                this.$healthBar.attr("value", value);

                if (value >= 60) {
                    this.$healthBar.removeClass("progress-warning progress-danger").addClass("progress-success");
                    this.$you.attr("src", this.imagePath + "good.svg");
                } else if (value >= 30 && value < 60) {
                    this.$healthBar.removeClass("progress-danger progress-success").addClass("progress-warning");
                    this.$you.attr("src", this.imagePath + "moderate.svg");
                } else if (value > 0) {
                    this.$healthBar.removeClass("progress-warning progress-success").addClass("progress-danger");
                    this.$you.attr("src", this.imagePath + "bad.svg");
                } else {
                    this.$you.attr("src", this.imagePath + "dead.svg");
                }
            }.bind(this));
        },

        initializeButtons: function() {
            var self = this;

            $("[data-score]").on("click", function() {
                self.socket.emit("add:score", $(this).data("score"));
            });
        },

        initialize: function () {
            this.imagePath = "/static/img/";
            this.socket = io();
            
            this.$connection = $("[data-connection]");
            this.$status = $("[data-status]");

            this.socket.on("connect", function() {
                this.$connection.addClass("connected");
            }.bind(this));
            
            this.socket.on("disconnect", function() {
                this.$connection.removeClass("connected");
            }.bind(this));

            this.socket.on("working", function(isWorking) {
                if(isWorking) {
                    this.$status.attr("src", this.imagePath + "working.png")
                } else {
                    this.$status.attr("src", this.imagePath + "not-working.png");
                }
            }.bind(this));

            this.initializeHealthBar();
            this.createTimeline();
            this.initializeButtons();
        }
    };

    $(function () {
        app.initialize();
    });

    return app;
})($);