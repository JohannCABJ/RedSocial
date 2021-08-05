const express = require('express');

const secure = require('./secure')
const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();

// Routes
router.get('/', list);
router.get('/:id', get);
router.post('/', secure ('follow'),upsert);

// functions
function list(req, res, next) {
    Controller.list()
        .then(data => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}
function get(req, res, next) {
    Controller.get(req.params.id)
        .then(data => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}
function upsert(req, res, next) {
    Controller.upsert(req.body)
        .then((data) => {
            response.success(req, res, data, 201);
        })
        .catch(next);
}

module.exports = router;