module.exports = {
    debug: true,
    printSensorValues: false,

    http: {
        port: 3000
    },
    
    arduino: {
        ports: {
            reader: "COM3",
            writer: "COM4"
        }
    },
    
    healthcare: {
        // limit of time to work in one go in minutes
        workLimit: 1,
        
        // amount of break time needed in minutes
        breakTime: 0.5,
        
        // loop interval in seconds
        loopInterval: 2,

        /**
         * factor setup
         *
         * maxFactor ... the force of the factor in case of bad conditions
         *
         * e.g. light.maxFactor: 1.25 means that under bad lightning conditions
         * the amount of time someone can work in one go is cut down by a quarter
         *
         * the force of a factor is not just 1 or maxFactor but a variation inbetween
         * depending on what the sensor picks up
         */

        /**
         * light factor
         */
        light: {
            maxFactor: 1.25
        },

        /**
         * temperature factor
         *
         * maxDifference defines how far the temperature can vary from the healthy
         * temperature until the maxFactor is applied
         *
         * e.g. maxDifference: 5, healthyTemperature: 20
         * if temperature <= 15 || 25 <= temperature --> apply maxFactor
         */
        temperature: {
            healthyTemperature: 20,
            maxFactor: 1.15,
            maxDifference: 5
        }
    }
};