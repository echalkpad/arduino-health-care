module.exports = {
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
        workLimit: 180,
        
        // amount of break time needed in minutes
        breakTime: 30,
        
        // loop interval in seconds
        loopInterval: 2,
        
        light: {
            maxFactor: 1.25
        },
        
        temperature: {
            healthyTemperature: 20,
            maxFactor: 1.15,
            maxDifference: 5
        }
    }
};