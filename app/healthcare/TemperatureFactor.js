const Color = require("color");
const AbstractFactor = require("./AbstractFactor");
7
const HEALTHY_TEMPERATURE = app.config.healthcare.temperature.healthyTemperature;
const MIN_FACTOR = 1;
const MAX_FACTOR = app.config.healthcare.temperature.maxFactor;
const MAX_DISTANCE = app.config.healthcare.temperature.maxDifference;

class TemperatureFactor extends AbstractFactor {
    onChange(temperature) {
        this.setValue(temperature);

        let diff = Math.abs(HEALTHY_TEMPERATURE - temperature);
        diff = Math.min(MAX_DISTANCE, diff);

        let percentage = ((diff) * 100) / (MAX_DISTANCE);
        
        let color = Color.hsl({
            h: (100 - percentage) / 100 * 120,
            s: 100,
            l: 50
        }).hex();

        this.getController().setTemperaturIndicator(color);

        this.setFactor((percentage * (MAX_FACTOR - MIN_FACTOR) / 100) + MIN_FACTOR);
    }

    getFactor() {
        return this.factor;
    }

    getValue() {
        return this.value;
    }
    
    destroy() {
        this.stopListening();
    }
}

TemperatureFactor.prototype.eventName = "temperature";
TemperatureFactor.prototype.minFactor = MIN_FACTOR;

module.exports = TemperatureFactor;