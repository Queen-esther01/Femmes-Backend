let logging = require('../utils/logger')
require('express-async-errors')


module.exports = function(){
    //Handling Uncaught Exception
    process.on('uncaughtException', (exception) => {
        logging.error(exception.message, exception)
        process.exit(1)
    })

    //Handling Unhandled Promise Rejection
    process.on('unhandledRejection', (exception: any) => {
        logging.error(exception.message, exception)
        process.exit(1)
    })

}