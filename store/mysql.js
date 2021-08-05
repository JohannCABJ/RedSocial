const mysql = require('mysql');

const config = require('../config');

const dbconf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

let connection;

function handleCon() { //Esta funcion va a manejar la conexión de todo lo que hagamos
    connection = mysql.createConnection(dbconf);

    connection.connect((err) => {
        if (err) {
            console.error('[db err]', err);
            setTimeout(handleCon, 2000); //esto es para volver a conectar, para que en el caso de que haya algun error de conexion lo intente reconectar
        } else {
            console.log('DB Connected!');
        }
    });

    connection.on('error', err => { //si hay algun error ya estando conectado y se cae esta
        console.error('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { //si se ha perdido la conexión
            handleCon(); //para volver a conectar
        } else {
            throw err; //devolverá un error si en realidad tenemos un error en la conexión con la DB
        }
    })
}

handleCon(); //ejecutamos la función para la conexión

function list(table) {
    return new Promise( (resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        })
    })
}
function get(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        })
    })
}
function insert(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}
function update(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE id=?`, [data,data.id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}
function upsert(table, data) {
   // if (data && data.id) {
        row = list (table)
        if (row.id === data.id){
        return update(table, data);
        }else {
        return insert(table, data);
    }
}
function query(table, query, join) {
    let joinQuery = '';
    if (join) {
        const key = Object.keys(join)[0];//key es la tabla user establecida en el join (de user/controller.js)
        const val = join[key];//val es el campo con el que se va a unir (en este caso es userTo)
        joinQuery = `JOIN ${key} ON ${table}.${val} = ${key}.id`;
    }

    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} ${joinQuery} WHERE ${table}.?`, query, (err, res) => {
            if (err) return reject(err);
            resolve(res[0] || null);
        })
    })
}

module.exports = {
    list,
    get,
    insert,
    update,
    upsert,
    query,
};