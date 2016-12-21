const five = require("johnny-five");
const events = require("backbone-events-standalone");

class AbstractBoard {
    constructor(id, port) {
        try {
            if(id && port) {
                this.board = new five.Board({
                    id: id,
                    port: port
                });
            } else {
                this.board = new five.Board();
            }

            this.board.on("ready", () => {
                this.onReady();
            });

            this.board.on("exit", () => {
                this.onExit();
            });

            this.board.on("error", () => {
                app.error("Could not initialize board " + this.id + " on port " + this.port);
            });
        } catch(exception) {
            app.error(exception);
        }
    }

    getBoard() {
        return this.board;
    }

    onReady() {}
    onExit() {}
    onDestroy() {}
    
    destroy() {
        this.onExit();
        this.onDestroy();
        this.stopListening();
    }
}

events.mixin(AbstractBoard.prototype);

module.exports = AbstractBoard;