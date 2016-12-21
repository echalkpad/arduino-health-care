const events = require("backbone-events-standalone");
const express = require("express");
const http = require("http");
const io = require("socket.io");
const path = require("path");

class App {
    constructor() {
        this.config = require("../config");
    }

    path() {
        let args = [ROOT_DIRECTORY];

        for(let argument of arguments) {
            args.push(argument);
        }

        return path.join.apply(null, args);
    }
    
    error() {
        console.error.apply(null, arguments);
    }

    log() {
        if(this.config.debug) {
            console.log.apply(null, arguments);
        }
    }

    start() {
        const Arduino = require("./arduino/Arduino");
        const HealthCare = require("./healthcare/HealthCare");
        
        /**
         * setup express
         */
        this.express = express();

        this.express.use("/static", express.static("static"));

        this.express.get("/", (req, res) => {
            res.sendFile(this.path("index.html"));
        });

        /**
         * setup http server
         */
        this.http = http.Server(this.express);

        this.http.listen(this.config.http.port, function() {
            console.log("application running on*:3000");
        });

        /**
         * setup socket io
         */
        this.io = io(this.http);

        /**
         * setup arduino
         */
        this.arduino = new Arduino();
        this.care = new HealthCare(this.arduino);

        this.arduino.once("ready", () => {
            this.care.start();
        });
    }

    getIo() {
        return this.io;
    }

    getSocket() {
        return this.socket;
    }
}

events.mixin(App.prototype);

module.exports = new App();