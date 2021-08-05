const response = require('./response');

function errors(err, req, res, next) {
    console.error('[error]', err);

    const message = err.message || 'Error interno'; //en lugar de mostrar toda la traza vamos a mostrar un mensaje
    const status = err.statusCode || 500;

    response.error(req, res, message, status);
}

module.exports = errors;