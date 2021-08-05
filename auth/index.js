const jwt = require('jsonwebtoken');
const config = require('../config');
const error = require('../utils/error')

const secret = config.jwt.secret;

function sign(data) {
    return jwt.sign(data, secret);
}

function verify(token) {
    return jwt.verify(token, secret)
}

const check = {
    own: function(req, owner) {
        const decoded = decodeHeader(req);
        console.log(decoded);

        if (decoded.id !== owner) { //comprobamos si es propio o no
            throw error('No puedes hacer esto',401) //reocordemos que el 401 hace referencia a que el usuario no está autorizado
        }
    },
    logged: function(req, owner) {
        const decoded = decodeHeader(req);
        console.log(decoded);
        return decoded;
    },
}

function getToken(auth) {
    if (!auth) {
        throw new Error('No viene token');
    }

    if (auth.indexOf('Bearer ') === -1) { //-1 significa en caso de que no lo encuentre
        throw new Error('Formato invalido');
    }

    let token = auth.replace('Bearer ', '');
    return token;
}

function decodeHeader(req) { //aqui decodificamos el token
    const authorization = req.headers.authorization || ''; //authorization es el header que queremos recibir
    const token = getToken(authorization); //tipo de cabecera que venga (es decir el texto de la cabecera)
    const decoded = verify(token);

    req.user = decoded;

    return decoded;
}

module.exports = {
    sign,
    check
};