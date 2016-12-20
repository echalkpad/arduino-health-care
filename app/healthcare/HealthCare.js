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

        if(this.timetracker.isWorking()) {
            app.log("working for " + this.timetracker.for() + " seconds");
        } else {
            app.log("taking a break for " + this.timetracker.for() + " seconds");
        }

        if(app.config.printSensorValues) {
            for (let i = 0; i < this.factors.length; i++) {
                let factor = this.factors[i];
                app.log(factor.eventName + " = " + factor.getValue());
            }
        }
        
        this.healthValue = Math.max(0, Math.min(100, this.healthValue + inc));

        app.log("health-status = " + this.healthValue);

        this.controller.setHealthCare(this.healthValue);
    }

    getHealthValue() {
        return this.healthValue;
    }

    stop() {
        clearInterval(this.interval);

        this.timetracker.destroy();
        this.timetracker = null;

        for(let i = 0; i < this.factors.length; i++) {
            this.factors[i].destroy();
        }
        
        this.factors = [];
    }
}

module.exports = HealthCare;