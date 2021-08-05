const auth = require('../../../auth')
const TABLA = 'auth';
const bcrypt = require('bcrypt')

module.exports = function (injectedStore) {
    let store = injectedStore;
    if (!store) {
        store = require('../../../store/mysql');
    }

    async function login (username, password){
        const data = await store.query(TABLA,{username: username})
            //console.log(data)
            return bcrypt.compare(password,data.password)
            .then(sonIguales =>{
                if(sonIguales === true){
                    return auth.sign({...data}) //esto genera un promesa que nos devuelve un token
                }else{
                    throw new Error ('Información inválida psswd')
                }
            })
    }

    async function upsert(data) {
        const authData = {
            id: data.id,//nos aseguramos que siempre haya un id,de esta forma el id de nuestros datos de autorizacion va a ser el mismo id del usuario
        }

        if (data.username) {
            authData.username = data.username;
        }

        if (data.password) {
            authData.password = await bcrypt.hash (data.password,5)//aqui hasea la psswd,para que en lugar de grabarse en limpio, se guarde hashseada //5; son las veces en que queremos que se ejecute el algoritmo , entre mas alto sea el salt, mas se demorará la encriptación de la contraseña
        }
        //console.log(`${authData}`)
        return store.upsert(TABLA, authData);
    }

    return {
        upsert,
        login
    };
};
