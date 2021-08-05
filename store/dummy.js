const db = {
    'user': [
        { id: '12', name: 'Johann' },
        { id: '7', name: 'Ricardo' },
    ],
};

async function list(tabla) {
    return db[tabla] || [];
}

async function get(tabla, id) {
    let col = await list(tabla);
    return col.filter(item => item.id === id)[0] || null;
}

async function upsert(tabla, data) {
    if (!db[tabla]){
        db[tabla] = []
    }

    db[tabla].push(data);
    return(`usuario ${db} ha sido agregado`)
}

async function remove(table, id) {
    let del = await list(table)
    del.findIndex(item => item.id === id)
    del.splice(del,1)
    return(`usuario ${id} eliminado` )

}

async function query(tabla, q) {
    let col = await list(tabla);
    let keys = Object.keys(q);
    let key = keys[0];

    return col.filter(item => item[key] === q[key])[0] || null;
}

module.exports = {
    list,
    get,
    upsert,
    remove,
    query
};