const events = require("backbone-events-standalone");
const Color = require("color");

const MIN_FACTOR = 1;
const MAX_FACTOR = app.config.healthcare.light.maxFactor;

class LightFactor {
    constructor(controller) {
        this.value = 0;
        this.factor = MIN_FACTOR;
        this.controller = controller;

        this.listenTo(this.controller, "light", this.onLight);
    }

    onLight(light) {
        this.value = light;

        let color = Color.hsl({
            h: Math.max(0, (light - 0.1)) * 120,
            s: 100,
            l: 50
        }).hex();

        this.controller.setLightIndicator(color);

        let perc = 100 - (light * 100);
        
        this.factor = (perc * (MAX_FACTOR - MIN_FACTOR) / 100) + MIN_FACTOR;
    }

    getFactor() {
        return this.factor;
    }
    
    getValue() {
        return this.value;
    }
}

LightFactor.prototype.KEY = "light";

events.mixin(LightFactor.prototype);

module.exports = LightFactor;