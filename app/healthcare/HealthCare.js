const LightFactor = require("./LightFactor");
const TemperatureFactor = require("./TemperatureFactor");
const TimeTracker = require("./TimeTracker");

const LINEAR_LIMIT = app.config.healthcare.workLimit * 60; // 3 hours in seconds
const LINEAR_BREAK = app.config.healthcare.breakTime * 60; // half an hour in seconds
const LOOP_INTERVAL = app.config.healthcare.loopInterval; // in seconds

const LINEAR_INCREASE = 100 / (LINEAR_LIMIT / LOOP_INTERVAL); // increase per loop
const LINEAR_DECREASE = -1 * 100 / (LINEAR_BREAK / LOOP_INTERVAL); // decrease per loop

class HealthCare {
    constructor(controller) {
        this.healthValue = 0;
        this.controller = controller;

        this.timetracker = new TimeTracker(this.controller);

        this.factors = [
            new LightFactor(this.controller),
            new TemperatureFactor(this.controller)
        ];

        this.controller
            .on("light", (light) => {
                app.getIo().emit("light", light);
            })
            .on("temperature", (temperature) => {
                app.getIo().emit("temperature", temperature);
            })
            .on("working", (isWorking) => {
                app.getIo().emit("working", isWorking);
            });

        this.messages = [{
            sent: false,
            sendAfter: 10,
            title: "Healthcare",
            body: "You have been working for {{time}} minutes. Your Healthvalue is {{health}}."
        }, {
            sent: false,
            sendAfter: 50,
            title: "Halftime",
            body: "You have been working for {{time}} minutes. Your Healthvalue is {{health}}."
        }, {
            sent: false,
            sendAfter: 75,
            title: "Almost there",
            body: "You have been working for {{time}} minutes. Your Healthvalue is {{health}}."
        }, {
            sent: false,
            sendAfter: 100,
            title: "Break time",
            body: "You have been working straight for {{time}} minutes. Your Healthvalue is {{health}}."
        }];
    }

    checkMessages() {
        for (let i = 0; i < this.messages.length; i++) {
            let message = this.messages[i];

            if (message.sendAfter <= this.healthValue && !message.sent && this.timetracker.isWorking()) {
                message.sent = true;

                this.sendMessage(message.title, message.body);
            }

            if (message.sent && message.sendAfter > this.healthValue && !this.timetracker.isWorking()) {
                message.sent = false;
            }
        }
    }

    sendMessage(title, body) {
        let icon = "/static/img/healthcare.png";

        app.getIo().emit("notification", icon, title, body.replace("{{time}}", this.timetracker.forMinutes()).replace("{{health}}", 100 - this.healthValue));
    }

    start() {
        this.interval = setInterval(() => {
            this.loop();
        }, LOOP_INTERVAL * 1000);
    }

    loop() {
        let inc = 0;

        if (this.timetracker.isWorking()) {
            inc = LINEAR_INCREASE;

            for (let i = 0; i < this.factors.length; i++) {
                let factor = this.factors[i];

                inc *= factor.getFactor();
            }
        } else {
            inc = LINEAR_DECREASE;
        }

        if (this.timetracker.isWorking()) {
            app.log("working for " + this.timetracker.forSeconds() + " seconds");
        } else {
            app.log("taking a break for " + this.timetracker.forSeconds() + " seconds");
        }

        if (app.config.printSensorValues) {
            for (let i = 0; i < this.factors.length; i++) {
                let factor = this.factors[i];
                app.log(factor.eventName + " = " + factor.getValue());
            }
        }

        this.healthValue = Math.round(Math.max(0, Math.min(100, this.healthValue + inc)) * 100) / 100;

        app.log("health-status = " + this.healthValue);
        app.getIo().emit("health", 100 - Math.round(this.healthValue));

        this.checkMessages();

        this.controller.setHealthCare(this.healthValue);
    }

    getHealthValue() {
        return this.healthValue;
    }

    stop() {
        clearInterval(this.interval);

        this.timetracker.destroy();
        this.timetracker = null;

        for (let i = 0; i < this.factors.length; i++) {
            this.factors[i].destroy();
        }

        this.factors = [];
    }
}

module.exports = HealthCare;