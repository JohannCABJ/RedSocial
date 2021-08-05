//En este archivos vamos a construir el servidor y todo lo que necesitemos
const express = require('express');
const auth = require('./components/auth/network')

const swaggerUi = require('swagger-ui-express'); //para integrar la documentacion del proyecto en nuestra api

const config = require('../config.js');
const user = require('./components/user/network');
const errors = require('../network/errors')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDoc = require('./swagger.json'); //traemos el archivo donde está la documentación

// ROUTER
app.use('/api/user', user);
app.use('/api/auth', auth);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc)); //la ruta donde vamos a acceder a la documentacion de nuestra API, la cuael esta guradada en el swagger.json

app.use(errors) //este middleware se debe colocar de ultimas, porque de lo contrario va a saltar antes que alguna de las otras rutas, esto se ejecutará cuando no encuentre ninguna de las anteriores rutas

app.listen(config.api.port, () => {
    console.log('Api escuchando en el puerto ', config.api.port);
});