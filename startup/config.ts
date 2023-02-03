const config = require('config')

module.exports = function(){
    if(!config.get('privateKey')){
        throw new Error('jWT private key is not defined')
    }
}