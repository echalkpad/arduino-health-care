const events = require("backbone-events-standalone");

class AbstractObserver {
    constructor(controller) {
        this.controller = controller;
    }

    getController() {
        return this.controller;
    }
    
    destroy() {
        this.onDestroy();

        this.stopListening();
        this.controller = null;
    }
    
    onDestroy() {}
}

events.mixin(AbstractObserver.prototype);

module.exports = AbstractObserver;