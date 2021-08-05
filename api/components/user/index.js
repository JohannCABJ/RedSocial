//Este archivo nos va a permitir hacer toda la exportación de los controladores
//const store = require('../../../store/mysql')
const config = require('../../../config')

let store, cache

if (config.remoteDB === true){
    store = require('../../../store/remote-mysql')
    cache = require('../../../store/remote-cache')
}else{
    store = require('../../../store/mysql')
    cache = require('../../../store/redis')//redis para cuando no tengamos las DB remotas
}

const ctrl = require('./controller') //aqui nos traemos el controlador de user


module.exports = ctrl (store, cache)