const Color = require("color");
const AbstractFactor = require("./AbstractFactor");

const MIN_FACTOR = 1;
const MAX_FACTOR = app.config.healthcare.light.maxFactor;

class LightFactor extends AbstractFactor {
    onChange(light) {
        this.setValue(light);

        let color = Color.hsl({
            h: Math.max(0, (light - 0.1)) * 120,
            s: 100,
            l: 50
        }).hex();

        this.getController().setLightIndicator(color);

        let percentage = 100 - (light * 100);
        
        this.setFactor((percentage * (MAX_FACTOR - MIN_FACTOR) / 100) + MIN_FACTOR);
    }

    getFactor() {
        return this.factor;
    }
    
    getValue() {
        return this.value;
    }
}

LightFactor.prototype.eventName = "light";
LightFactor.prototype.minFactor = MIN_FACTOR;

module.exports = LightFactor;