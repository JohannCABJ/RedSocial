const {nanoid} = require('nanoid'); //libreria para generar Id's
const auth = require('../auth/');

const TABLA = 'user';

module.exports = function (injectedStore, injectedCache) {
    let store = injectedStore;
    let cache = injectedCache;

    if (!store) {
        store = require('../../../store/mysql');
    }

    if (!cache) {
        cache = require('../../../store/dummy');
    }

    async function list() {
        let users = await cache.list(TABLA);

        if (!users) {
            console.log('No estaba en caché. Buscando en DB')
            users = await store.list(TABLA);
            cache.upsert(TABLA, users);
        } else {
            console.log('Nos traemos datos de cache');
        }

        return users;
    }

    function get(id) {
        return store.get(TABLA, id);
    }

    async function upsert(body) {
        const user = {
            name : body.name,
            username: body.username,
        }

        if (body.id) {
            user.id = body.id;
        } else {
            user.id = nanoid();
        }

        if (body.password || body.username) {
            await auth.upsert({
                id: user.id,
                username: user.username,
                password: body.password,
            })
        }

        return store.upsert(TABLA, user);
    }

    function remove(idu) {

        return store.remove(TABLA,idu);
    }

    function follow(from, to) {
        return store.insert(TABLA + '_follow', {
            userFrom: from,
            userTo: to,
        });
    }

    async function following(user) {
        const join = {}
        join[TABLA] = 'userTo'; // { user: 'user_to' },la tabla user es la key, y userTo es el value del objeto join
        const query = { userFrom: user }; //where userFrom = user

		return await store.query(TABLA + '_follow', query, join);
	}



    return {
        list,
        get,
        upsert,
        remove,
        follow,
        following
    };
}