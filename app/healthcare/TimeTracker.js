const AbstractObserver = require("./AbstractObserver");

class TimeTracker extends AbstractObserver {
    constructor(controller) {
        super(controller);

        this.controller = controller;
        this.working = false;
        this.changedAt = this.now();

        this.debounce = null;

        this.listenTo(this.controller, "working", this.onChange);
    }

    now() {
        return Math.round(new Date().getTime() / 1000);
    }

    onChange(isWorking) {
        clearTimeout(this.debounce);

        this.debounce = setTimeout(() => {
            if (isWorking != this.working) {
                app.log("work status changed. " + (isWorking ? "working" : "taking a break"));

                this.working = isWorking;

                this.changedAt = this.now();
            }
        }, 2000);
    }

    isWorking() {
        return this.working;
    }

    forSeconds() {
        return this.now() - this.changedAt;
    }

    forMinutes() {
        let seconds = this.now() - this.changedAt;

        return Math.round(seconds / 60 * 100) / 100;
    }
}

module.exports = TimeTracker;