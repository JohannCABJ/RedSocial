const redis = require('redis');

const config = require('../config');

const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
});

function list(table) {
    return new Promise((resolve, reject) => {
        client.get(table, (err, data) => { //client>> es la llamada a redis
            if (err) return reject(err);

            let res = data || null;
            if (data) {
                res = JSON.parse(data); 
            }
            resolve(res);
        });
    });
}

function get(table, id) {
    //
}

async function upsert(table, data) {
    let key = table;
    if (data && data.id) {
        key = key + '_' + data.id;
    }

    client.setex(key, 10, JSON.stringify(data)); //setex = seet para hacer el set (el update) y ex = para hacer el time de expiration, 10 son los segunds de expiracion //stringify convierte los strings a objetos (redis los guarda como strings muy grandes) por lo tanto hay que converirlo a objeto)
    return true;
}

module.exports = {
    list,
    get,
    upsert,
};