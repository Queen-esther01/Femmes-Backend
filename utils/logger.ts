const winston = require('winston');

//LOGGER
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'logFile.log' })
    ]
})


module.exports = logger