const express = require('express');
const config = require('../config.js');
const post = require('./components/post/network');
const errors = require('../network/errors');

const app = express(); //seteamos la aplicación

app.use(express.urlencoded({ extended: true }));

// ROUTER
app.use('/api/post', post);

app.use(errors);

app.listen(config.post.port, () => {
    console.log('Servicio posts escuchando en el puerto ', config.post.port);
});