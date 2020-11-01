const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtAuthenticate = passport.authenticate('jwt',{session:false});
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const validarPedidoLogin = require('../usuarios/usuarios.validate').validarPedidoLogin;
const validarUsuario = require('../usuarios/usuarios.validate').validarUsuario;
const usuariosController = require('../usuarios/usuarios.controller');
const {CredencialesIncorrectas,ErrorDeBaseDeDatos} = require('./usuarios.errors');
const {UsuarioNoExiste} = require('./usuarios.errors');
const config = require('./../../../config')
const usuarioRouter = express.Router();

function pasarBodyAminusculas(req,res,next){
    req.body.username && req.body.username.toLowerCase();
    req.body.password && req.body.password.toLowerCase();
    next()
}

usuarioRouter.get( // esta ruta la uso para poder reconectar al usuario si hay un token
    '/whoami',      // en su localStorage. Entra aquí, lo captura el middleware de autenticación
    [jwtAuthenticate],    // si el token es válido le añade al request el usuario que encontró
    procesarErrores(async (req, res) => {
      res.json(req.user);
    })
  );

usuarioRouter.post('/login',[validarPedidoLogin,pasarBodyAminusculas],procesarErrores((req,res)=>{

    let {username,password} = req.body;

   return usuariosController.validarLogin(username,password)
    .then(
        usuario=>{

            const usuarioNoRegistrado = usuario.recordset;

            log.info(`el usuario trata de loguearse ${username}`)

            if (usuarioNoRegistrado.length===0){
                throw new CredencialesIncorrectas();
            }

            //  si es un usuario valido creamos un token.
            // Dentro de la info del token guardamos su id para que podamos validar ese dato
            // en los requests que recibamos contra la api

            let token = jwt.sign({id: usuarioNoRegistrado[0].id_usuario, nombre:usuarioNoRegistrado[0].nombre, id_region: usuarioNoRegistrado[0].id_region}, 
                                    config.jwt.secreto,
                                    {expiresIn:config.jwt.tiempoDeExpiracion}
                                )

            log.info(`Se loguea ${usuarioNoRegistrado[0].nombre}`)
            res.status(200).json({ token, usuario: usuarioNoRegistrado[0] })
        }
    )
}))


module.exports = usuarioRouter