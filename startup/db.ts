const log = require('../utils/logger')
const mongoose = require('mongoose')


module.exports = function(){
    mongoose.connect('mongodb://localhost/femme')
    .then(()=> log.info('Connected to femme database...'))
    //.catch((err: unknown) => console.error('Could not connect to femme database...', err))
}