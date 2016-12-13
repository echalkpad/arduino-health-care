const five = require("johnny-five");
const AbstractBoard = require("../AbstractBoard");

class Reader extends AbstractBoard {
    onReady() {
        var self = this;
        this.temperatures = [];

        this.powerPin1 = new five.Pin(2);
        this.powerPin2 = new five.Pin(3);
        this.powerPin3 = new five.Pin(4);

        this.powerPin1.high();
        this.powerPin2.high();
        this.powerPin3.high();

        this.groundPin1 = new five.Pin(5);
        this.groundPin1.low();

        this.thermo = new five.Thermometer({
            controller: "LM35",
            pin: "A0",
            freq: 200
        });

        this.thermo.on("change", function() {
            self.temperatures.push(this.celsius);

            if(self.temperatures.length > 30) {
                self.temperatures.shift();
            }

            let temp = 0;
            for(let i = 0; i < self.temperatures.length; i++) {
                temp += self.temperatures[i];
            }

            temp = temp / self.temperatures.length;

            console.log("TEMP: " + temp);
        });

        this.light = new five.Light({
            pin: "A3",
            freq: 200
        });
        this.light.on("change", function() {
            // console.log(this.level * 100);
        });

        this.pressure = new five.Sensor({
            pin: "A4",
            freq: 200
        });
        this.pressure.on("change", function() {
           // console.log("PRESSURE: " + this.scaleTo(0, 100));
        });
    }

    onExit() {

    }
}

module.exports = Reader;