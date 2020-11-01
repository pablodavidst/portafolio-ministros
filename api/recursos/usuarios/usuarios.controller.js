
const { sql,poolPromise } = require('./../../../database/db')
const {ErrorDeBaseDeDatos} = require('./usuarios.errors');
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const utilFechas = require('../../../utils/fechas')

const log = require('../../../utils/logger');
const dbconfig = require('./../../../config').dbconfig;

async function validarLogin(username , password){

    try{

        const pool = await poolPromise

        return pool.request() 
        .input('usr', sql.VarChar, username)
        .input('pwd', sql.VarChar, password)
        .execute('sp_web_iniciar_sesion_region')
    }catch (err) {
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }

}

async function obtenerUsuario(id){

    try {
        const pool = await poolPromise

        return pool.request() 
        .input('id_usuario', sql.Int, id)
        .execute('sp_web_obtener_usuario_new')

    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

module.exports={
    validarLogin,
    obtenerUsuario
}