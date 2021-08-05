const express = require('express');

const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();//aqui creamos el router

router.post('/login',function(req,res) {
    Controller.login(req.body.username,req.body.password)
    .then(token => {
        response.success(req,res,token,200)
    })
    .catch(e =>{
        response.error(req,res,'Informacion inválidaa',400)
    })
})

module.exports = router;
