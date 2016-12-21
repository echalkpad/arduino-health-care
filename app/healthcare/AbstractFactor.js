const AbstractObserver = require("./AbstractObserver");

class AbstractFactor extends AbstractObserver {
    constructor(controller) {
        super(controller);

        this.value = 0;
        this.factor = this.minFactor;

        this.listenTo(this.getController(), this.eventName, this.onChange);
    }

    onChange() {
    }

    getValue() {
        return this.value;
    }

    getFactor() {
        return this.factor
    }
    
    setValue(value) {
        this.value = value;
    }
    
    setFactor(factor) {
        this.factor = factor;
    }
}

module.exports = AbstractFactor;