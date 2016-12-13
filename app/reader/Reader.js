const five = require("johnny-five");
const AbstractBoard = require("../AbstractBoard");

const TEMPERATURE_APPROX = 50;

class Reader extends AbstractBoard {
    onReady() {
        this.temperatures = [];

        this.thermo = new five.Thermometer({
            controller: "LM35",
            pin: "A2",
            freq: 200
        });

        this.thermo.on("change", () => {
            this.temperatures.push(this.thermo.celsius);

            if(this.temperatures.length > TEMPERATURE_APPROX) {
                this.temperatures.shift();
            }

            let temp = 0;
            for(let i = 0; i < this.temperatures.length; i++) {
                temp += this.temperatures[i];
            }

            temp = temp / this.temperatures.length;

            console.log("TEMP: " + temp);
        });

        this.light = new five.Light({
            pin: "A0",
            freq: 200
        });
        this.light.on("change", function() {
            console.log("LIGHT:" + this.level * 100);
        });

        this.pressure = new five.Sensor({
            pin: "A4",
            freq: 200
        });
        this.pressure.on("change", function() {
            app.getIo().emit("pressure", this.scaleTo(0, 100), "hello");
           console.log("PRESSURE: " + this.scaleTo(0, 100));
        });

        this.temperaturIndicator = new five.Led.RGB({
            pins: {
                red: 6,
                green: 5,
                blue: 3
            },
            isAnode: true
        });

        this.lightIndicator = new five.Led.RGB({
            pins: {
                red: 11,
                green: 10,
                blue: 9
            },
            isAnode: true
        });

        this.temperaturIndicator.intensity(50);
        this.lightIndicator.intensity(50);

        this.servo = new five.Servo(12);
    }

    onExit() {

    }
}

module.exports = Reader;