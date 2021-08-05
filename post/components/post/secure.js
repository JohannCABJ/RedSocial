const auth = require('../../../auth');

module.exports = function checkAuth(action) { //esta funcion crea el middleware

    function middleware(req, res, next) {
        switch(action) {
            case 'update':
                const owner = req.body.id; //Este sería el usuario que quiere hacer modificaciones
                auth.check.own(req, owner);
                next()
                break;

                case 'follow':
                auth.check.logged(req);
                next()
                break;


            default:
                next();
        }
    }

    return middleware;
}