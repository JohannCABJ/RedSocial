const express = require('express');

const config = require('../config');
const router = require('./network');

const app = express();

app.use(express.urlencoded({ extended: true }));

// RUTAS
app.use('/', router)

app.listen(config.cacheService.port, () => {
    console.log('Servicio de caché redis escuchando en el puerto', config.cacheService.port);
})