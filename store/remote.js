const request = require('request');//para hacer consultas http mucho mas sencillas

function createRemoteDB(host, port) {
    const URL = 'http://'+ host + ':' + port; //esta es la base de la url para todo lo que hagamos

    function list(table) { //aqui contrsuimos las funciones para todo lo que hayamos hecho
        return req('GET', table);
    }

	function get(table, id) {
		return req('GET', table, id);
	}

	function insert(table, data) {
		return req('POST', table, data);
	}

	function update(table, data) {
		return req('PUT', table, data);
	}

	function upsert(table, data) {
		if (data.id) {
			return update(table, data);
		}

		return insert(table, data);
	}

	function query(table, query, join) {
		return req('POST', table + '/query', { query, join });
	}

    function req(method, table, data) {
        let url = URL + '/' + table; //seteamos al url a la que vamos a hacer la petición
        body = '';

        return new Promise((resolve, reject) => { //esta promesa va a ejecutar el request
            request({
                method,
                headers: {
                    'content-type': 'application/json'
                },
                url,
                body,
            }, (err, req, body) => { //el segundo parámetro del request es el cb
                if (err) {
                    console.error('Error con la base de datos remota', err);
                    return reject(err.message);
                }

                const resp = JSON.parse(body); //lo parseamos a json porque inicialmente viene como un texto plano
                return resolve(resp.body); //body es como estamos llamando a todo el cuerpo de nuestra peticion
            })
        })
    }

    return {
        list,
        get,
        insert,
        update,
        upsert,
        query
    }
}

module.exports = createRemoteDB;