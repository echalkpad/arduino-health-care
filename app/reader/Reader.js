const five = require("johnny-five");
const AbstractBoard = require("../AbstractBoard");
const events = require("backbone-events-standalone");

const TEMPERATURE_APPROX = 50;
const PRESSURE_MIN = 0.15;

class Reader extends AbstractBoard {
    onReady() {
        /**
         * initialize thermo, approximate values
         * due to sensor inconsistencies
         */
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

            this.temperature = temp;

            this.trigger("temperature", this.getTemperature());
        });

        /**
         * initialize light sensor
         */
        this.light = new five.Light({
            pin: "A0",
            freq: 200
        });

        this.light.on("change", () => {
            this.trigger("light", this.getLight());
        });

        /**
         * initialize pressure sensor
         */
        this.pressure = new five.Sensor({
            pin: "A4",
            freq: 200
        });

        /**
         * initialize indicators
         */
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

        this.servo = new five.Servo({
            pin: 12
        });
    }

    getTemperature() {
        return this.temperature;
    }

    getLight() {
        return this.light.level;
    }

    isWorking() {
        return this.pressure.value > PRESSURE_MIN;
    }

    setTemperaturIndicator(color) {
        this.temperaturIndicator.color(color);
    }

    setLightIndicator(color) {
        this.lightIndicator.color(color);
    }

    setHealthCare(value) {
        console.log(value);
        this.servo.to(value * 180 / 100);
    }
}

events.mixin(Reader.prototype);

module.exports = Reader;