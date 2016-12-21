const LightFactor = require("./LightFactor");
const TemperatureFactor = require("./TemperatureFactor");
const TimeTracker = require("./TimeTracker");

const LINEAR_LIMIT = app.config.healthcare.workLimit * 60; // 3 hours in seconds
const LINEAR_BREAK = app.config.healthcare.breakTime * 60; // half an hour in seconds
const LOOP_INTERVAL = app.config.healthcare.loopInterval; // in seconds

const LINEAR_INCREASE = 100 / (LINEAR_LIMIT / LOOP_INTERVAL); // increase per loop
const LINEAR_DECREASE = -1 * 100 / (LINEAR_BREAK / LOOP_INTERVAL); // decrease per loop

const notiMessages = [
    'I\'m intimidated by the fear of being average.',
    'Just be yourself, there is no one better.',
    'I never want to change so much that people can\'t recognize me.',
    'I suffer from girlnextdooritis where the guy is friends with you and that\'s it',
    'People are people and sometimes we change our minds.',
    'Darling, I’m a nightmare dressed like a daydream.',
    'I could dance to this beat forevermore.',
    'I make the moves up as I go.',
    'This is the golden age of something good and right and real.'
];

class HealthCare {
    constructor(controller) {
        this.healthValue = 0;
        this.controller = controller;
        this.isExtendingWorkingTime = false;

        this.timetracker = new TimeTracker(this.controller);

        this.factors = [
            new LightFactor(this.controller),
            new TemperatureFactor(this.controller)
        ];

        app.getIo().on("connection", (socket) => {
            socket.on("add:score", (value) => {
                if(this.isExtendingWorkingTime) return;

                this.isExtendingWorkingTime = true;

                this.healthValue -= value;

                setTimeout(() => {
                    this.isExtendingWorkingTime = false;
                }, 300000);
            });
        });

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
            title: "Yoda says ...",
            //body: "You have been working for {{time}} minutes. Your Healthvalue is {{health}}."
        }, {
            sent: false,
            sendAfter: 50,
            title: "Yoda says ...",
            //body: "You have been working for {{time}} minutes. Your Healthvalue is {{health}}."
        }, {
            sent: false,
            sendAfter: 75,
            title: "Yoda says ...",
            //body: "You have been working for {{time}} minutes. Your Healthvalue is {{health}}."
        }, {
            sent: false,
            sendAfter: 100,
            title: "Yoda says ...",
            body: "Much to learn you still have young padavan. But now take a break you have to."
        }];
    }

    checkMessages() {
        for (let i = 0; i < this.messages.length; i++) {
            let message = this.messages[i];

            if (message.sendAfter <= this.healthValue && !message.sent && this.timetracker.isWorking()) {
                message.sent = true;

                let body = message.body || notiMessages[Math.floor(Math.random() * 10)];

                this.sendMessage(message.title, body);
            }

            if (message.sent && message.sendAfter > this.healthValue && !this.timetracker.isWorking()) {
                message.sent = false;
            }
        }
    }

    sendMessage(title, body) {
        let icon = "/static/img/healthcare.png";

        app.getIo().emit("notification", icon, title, body.replace("{{time}}", this.timetracker.forMinutes()).replace("{{health}}", 100 - Math.round(this.healthValue)));
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