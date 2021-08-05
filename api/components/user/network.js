//Esta es toda la parte de red del componente user
const express = require('express');

const secure = require('./secure')
const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();//aqui creamos el router

// Routes
router.get('/', list)
router.post('/follow/:id', secure('follow'), follow);
router.get('/:id/following', following);
router.get('/:id', get);
router.post('/', upsert);
router.put('/', secure ('update'),upsert); //aqui agreamos el middleware de seguridad que hemnos creado
router.delete('/remove/:id', remove);

// Internal functions
function list(req, res, next) {
    Controller.list()
        .then((lista) => {
            response.success(req, res, lista, 200);
        })
        .catch(next)
}

function get(req, res,next) {
    Controller.get(req.params.id)
        .then((user) => {
            response.success(req, res, user, 200);
        })
        .catch(next)
}

function upsert(req, res,next) {
    Controller.upsert(req.body)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch(next)
}

function remove(req, res, next) {
    Controller.remove(req.params.id,)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch(next)
}

function follow(req, res, next){
    Controller.follow(req.user.id, req.params.id)
        .then((data)=>{
            return response.success(req, res,data,200)
        })
        .catch(next)
}

function following(req, res, next) {
	return Controller.following(req.params.id)
		.then( (data) => {
			return response.success(req, res, data, 200);
		})
		.catch(next);
}


module.exports = router;