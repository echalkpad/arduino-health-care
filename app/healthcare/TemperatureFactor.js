const Color = require("color");
const events = require("backbone-events-standalone");

const HEALTHY_TEMPERATURE = app.config.healthcare.temperature.healthyTemperature;

const MIN_FACTOR = 1;
const MAX_FACTOR = app.config.healthcare.temperature.maxFactor;

const MAX_DISTANCE = app.config.healthcare.temperature.maxDifference;

class TemperatureFactor {
    constructor(controller) {
        this.value = 0;
        this.factor = 1;
        this.controller = controller;

        this.listenTo(this.controller, "temperature", this.onTemperature);
    }

    onTemperature(temperature) {
        this.value = temperature;

        let diff = Math.abs(HEALTHY_TEMPERATURE - temperature);
        diff = Math.min(MAX_DISTANCE, diff);

        let perc = ((diff) * 100) / (MAX_DISTANCE);
        
        let color = Color.hsl({
            h: (100 - perc) / 100 * 120,
            s: 100,
            l: 50
        }).hex();

        this.controller.setTemperaturIndicator(color);

        this.factor = (perc * (MAX_FACTOR - MIN_FACTOR) / 100) + MIN_FACTOR;
    }

    getFactor() {
        return this.factor;
    }

    getValue() {
        return this.value;
    }
}

TemperatureFactor.prototype.KEY = "temperature";

events.mixin(TemperatureFactor.prototype);

module.exports = TemperatureFactor;