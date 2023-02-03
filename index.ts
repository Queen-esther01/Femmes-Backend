import express, { Application } from 'express'
const logs = require('./utils/logger')
const app:Application = express()

require("dotenv").config();
require('./startup/logging')
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')()


const port = process.env.PORT || 3001
app.listen(port, ():void => {
    logs.info(`Listening on port ${port}`);
})