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
    
    error(message) {
        console.error(message);
    }

    start() {
        const Reader = require("./reader/Reader");
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
         * setup arduino boards
         * @type {Reader}
         */
        this.arduino = new Reader();
        
        this.care = new HealthCare(this.arduino);
        this.care.start();
    }

    getIo() {
        return this.io;
    }
}

events.mixin(App.prototype);

module.exports = new App();