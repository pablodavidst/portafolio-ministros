const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtAuthenticate = passport.authenticate('jwt',{session:false});
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const tablasgeneralesController = require('../../recursos/tablasgenerales/tablasgenerales.controller')
const config = require('./../../../config')
const tablasgeneralesRouter = express.Router();
const ParametrosEntradaIncompletos = require('./tablasgenerales.errors').ParametrosEntradaIncompletos;
const DatosRepetidos = require('./tablasgenerales.errors').DatosRepetidos;
const validarCuatrimestre = require('./tablasgenerales.validate').validarCuatrimestre;
const validarInstrumento = require('./tablasgenerales.validate').validarInstrumento;
const validarInstrumentoRepetido = require('./tablasgenerales.validate').validarInstrumentoRepetido;
const validarAulaRepetida = require('./tablasgenerales.validate').validarAulaRepetida;
const validarAula = require('./tablasgenerales.validate').validarAula;
const validarCuatrimestreRepetido = require('./tablasgenerales.validate').validarCuatrimestreRepetido;
const validarObrero = require('./tablasgenerales.validate').validarObrero;
const validarIglesia = require('./tablasgenerales.validate').validarIglesia;
const validarMateriaRepetida = require('./tablasgenerales.validate').validarMateriaRepetida;
const fechas = require('../../../utils/fechas');
const { verificarNroDocumento } = require('../../recursos/tablasgenerales/tablasgenerales.controller');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
var fs = require('fs');
const fileUpload = require('express-fileupload');

const mesesdjson = [{"iglesia":"Ejemplo","periodo":"2020 - November","comprobante":"--","fecha_registr":null,"diezmo":0},{"iglesia":"Ejemplo","periodo":"2020 - October","comprobante":"--","fecha_registr":null,"diezmo":0},{"iglesia":"Ejemplo","periodo":"2020 - September","comprobante":"--","fecha_registr":null,"diezmo":0},{"iglesia":"Ejemplo","periodo":"2020 - August","comprobante":"C24173","fecha_registr":"2020-09-09","diezmo":3833.33},{"iglesia":"Ejemplo","periodo":"2020 - July","comprobante":"C24173","fecha_registr":"2020-09-09","diezmo":3833.33},{"iglesia":"Ejemplo","periodo":"2020 - June","comprobante":"C24173","fecha_registr":"2020-09-09","diezmo":3833.33},{"iglesia":"Ejemplo","periodo":"2020 - June","comprobante":"C23337","fecha_registr":"2020-06-24","diezmo":3404.29},{"iglesia":"Ejemplo","periodo":"2020 - May","comprobante":"C23337","fecha_registr":"2020-06-24","diezmo":3404.29},{"iglesia":"Ejemplo","periodo":"2020 - April","comprobante":"C23337","fecha_registr":"2020-06-24","diezmo":3404.29},{"iglesia":"Ejemplo","periodo":"2020 - March","comprobante":"C23337","fecha_registr":"2020-06-24","diezmo":3404.29},{"iglesia":"Ejemplo","periodo":"2020 - February","comprobante":"C23337","fecha_registr":"2020-06-24","diezmo":3404.29}]

const iglesiasjson = [{"nombre":"Iglesia Ejemplo","localidad":"Parque Chacabuco, Ciudad Autónoma De Buenos Aires","provincia":"CABA","region":"Región 1","tipo_iglesia":"Autónoma","encargado":"Pr. Ejemplo","cod_iglesia":"36","id_iglesia":6,"presentacion":"Iglesia Ejemplo - CABA (Ciudad Autónoma De Buenos Aires)","pagina_web":"www.ejemplo.org","telefono":"011-15151-8920","fax":"","fich_culto":true,"hab_municip":true,"hogar_niños":false,"cant_miembros":16000,"comedor":false,"colegio":false,"dispensario":false,"libro_cont":true,"pastor":"Ejemplo","predio_recreat":false,"rehabilit":true,"seguro":true,"estado_balances":0,"detalle_diezmos":0,"cod_postal":"1424","id_provincia":21,"direccion":"Av. Ejemplo 140","barrio":"Parque Ejemplo"}]

const ingresosjson = [{"fecha":"03/11/2020","comprobante":"C24870","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Belgrano R (Ciudad Autónoma de Buenos Aires), CABA","det_rc":"Oct-2020 ","monto":"5,000.00"},{"fecha":"03/11/2020","comprobante":"C24871","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Dallera  (Campana), Buenos Aires","det_rc":"Oct-2020 ","monto":"2,600.00"},{"fecha":"03/11/2020","comprobante":"C24874","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Villa Lugano (Capital Federal), CABA","det_rc":"Oct-2020 ","monto":"1,880.00"},{"fecha":"03/11/2020","comprobante":"C24875","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Ranelagh, Buenos Aires (Berazategui)","det_rc":"Oct-2020 ","monto":"10,000.00"},{"fecha":"03/11/2020","comprobante":"C24876","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"centro (Lujan), Buenos Aires","det_rc":"Jun-2020 , Jul-2020 , Ago-2020 , Sep-2020 ","monto":"10,100.00"},{"fecha":"03/11/2020","comprobante":"C24877","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Berazategui, Buenos Aires","det_rc":"Oct-2020 ","monto":"1,000.00"},{"fecha":"03/11/2020","comprobante":"C24878","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Sarmiento (Villa Ballester), Buenos Aires (San Martin)","det_rc":"Sep-2020 ","monto":"12,000.00"},{"fecha":"04/11/2020","comprobante":"C24879","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Almagro (Capital Federal), CABA","det_rc":"Mar-2020 , Abr-2020 , May-2020 , Jun-2020 , Jul-2020 , Ago-2020 , Sep-2020 , Oct-2020 ","monto":"10,000.00"},{"fecha":"04/11/2020","comprobante":"C24880","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Loma Hermosa, Buenos Aires (Tres de Febrero)","det_rc":"Oct-2020 ","monto":"12,000.00"},{"fecha":"04/11/2020","comprobante":"C24881","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Bo. Reconquista (Merlo), Buenos Aires","det_rc":"Ago-2020 , Sep-2020 ","monto":"2,000.00"},{"fecha":"04/11/2020","comprobante":"C24882","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Bo. La Boca (Capital Federal), CABA","det_rc":"Sep-2020 ","monto":"15,250.00"},{"fecha":"04/11/2020","comprobante":"C24883","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Bo. La Boca (Capital Federal), CABA","det_rc":"Oct-2020 ","monto":"15,800.00"},{"fecha":"04/11/2020","comprobante":"C24884","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Bo. Reconquista (Merlo), Buenos Aires","det_rc":"Sep-2020 ","monto":"2,000.00"},{"fecha":"04/11/2020","comprobante":"C24889","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Los cardales, Pdo. de Exaltacion De La Cruz, Buenos Aires","det_rc":"Sep-2020 ","monto":"6,390.00"},{"fecha":"04/11/2020","comprobante":"C24890","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Moron (Moron), Buenos Aires","det_rc":"Ene-2020 , Feb-2020 ","monto":"70,000.00"},{"fecha":"04/11/2020","comprobante":"C24891","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Moron (Moron), Buenos Aires","det_rc":"Jul-2020 , Ago-2020 ","monto":"70,000.00"},{"fecha":"05/11/2020","comprobante":"C24892","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Moron (Moron), Buenos Aires","det_rc":"Sep-2020 , Oct-2020 ","monto":"70,000.00"},{"fecha":"05/11/2020","comprobante":"C24893","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Cdad. Jardín  (El Palomar), Buenos Aires (Tres de Febrero)","det_rc":"Oct-2020 ","monto":"7,000.00"},{"fecha":"05/11/2020","comprobante":"C24894","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Don Torcuato, Buenos Aires (Tigre)","det_rc":"Sep-2020 ","monto":"20,000.00"},{"fecha":"05/11/2020","comprobante":"C24895","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Villa Del Carmen - G. Catan (La Matanza), Buenos Aires","det_rc":"Sep-2020 , Oct-2020 ","monto":"20,000.00"},{"fecha":"05/11/2020","comprobante":"C24896","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Bo. Textil (Guillermo E. Hudson), Buenos Aires (Berazategui)","det_rc":"Oct-2020 ","monto":"14,940.00"},{"fecha":"05/11/2020","comprobante":"C24897","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Miramar, Buenos Aires (General Alvarado)","det_rc":"Oct-2020 ","monto":"15,320.00"},{"fecha":"05/11/2020","comprobante":"C24899","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Bo. Chacarita (Capital Federal), CABA","det_rc":"Sep-2020 ","monto":"2,500.00"},{"fecha":"05/11/2020","comprobante":"C24903","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Bernal Oeste, Buenos Aires (Quilmes)","det_rc":"Sep-2020 ","monto":"3,000.00"},{"fecha":"05/11/2020","comprobante":"C24905","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Villa Escobar (Francisco Alvarez), Buenos Aires (Moreno)","det_rc":"Oct-2020 ","monto":"30,000.00"},{"fecha":"05/11/2020","comprobante":"C24906","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Villa Escobar (Francisco Alvarez), Buenos Aires (Moreno)","det_rc":"Oct-2020 ","monto":"1,000.00"},{"fecha":"05/11/2020","comprobante":"C24907","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Villa Escobar (Francisco Alvarez), Buenos Aires (Moreno)","det_rc":"Oct-2020 ","monto":"500.00"},{"fecha":"05/11/2020","comprobante":"C24908","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Villa Escobar (Francisco Alvarez), Buenos Aires (Moreno)","det_rc":"Oct-2020 ","monto":"500.00"},{"fecha":"05/11/2020","comprobante":"C24909","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Martinez, Buenos Aires (San Isidro)","det_rc":"Ene-2020 , Feb-2020 , Mar-2020 , Abr-2020 , May-2020 , Jun-2020 , Jul-2020 , Ago-2020 ","monto":"18,000.00"},{"fecha":"05/11/2020","comprobante":"C24910","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"La Plata, Buenos Aires","det_rc":"Oct-2020 ","monto":"22,650.00"},{"fecha":"05/11/2020","comprobante":"C24911","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"La Plata, Buenos Aires","det_rc":"Ene-2020 ","monto":"1,100.00"},{"fecha":"05/11/2020","comprobante":"C24912","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"La Plata, Buenos Aires","det_rc":"Feb-2020 ","monto":"1,600.00"},{"fecha":"05/11/2020","comprobante":"C24913","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"La Plata, Buenos Aires","det_rc":"Mar-2020 , Abr-2020 , May-2020 , Jun-2020 ","monto":"3,930.00"},{"fecha":"05/11/2020","comprobante":"C24914","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"La Plata, Buenos Aires","det_rc":"Feb-2020 , Mar-2020 , Abr-2020 , May-2020 , Jun-2020 , Jul-2020 , Ago-2020 , Sep-2020 ","monto":"4,000.00"},{"fecha":"05/11/2020","comprobante":"C24915","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"La Plata, Buenos Aires","det_rc":"Feb-2020 , Mar-2020 , Abr-2020 , May-2020 , Jun-2020 , Jul-2020 , Ago-2020 , Sep-2020 ","monto":"2,200.00"},{"fecha":"05/11/2020","comprobante":"C24916","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"La Plata, Buenos Aires","det_rc":"Abr-2020 , May-2020 , Jun-2020 , Jul-2020 , Ago-2020 , Sep-2020 ","monto":"2,400.00"},{"fecha":"05/11/2020","comprobante":"C24918","contribuyente":"ejemplo","titular":"titular","domicilio":"domicilio","provincia":"Crisol (Victoria), Buenos Aires (San Fernando)","det_rc":"Ago-2020 , Sep-2020 , Oct-2020 ","monto":"23,600.00"}]

const verificarNroDocumentoObrero = (req,res,next) =>{
    const {nro_documento} = req.body 

    tablasgeneralesController.verificarNroDocumento(nro_documento)
    .then(respuesta=>{
        if (respuesta.recordset.length>0){

            log.info(JSON.stringify(respuesta))
            res.status(400).send(`El número de documento está en uso. El obrero ${respuesta.recordset[0].nombre} de la región ${respuesta.recordset[0].region} tiene el mismo número de documento`)
        }else{
            next()
        }

    }).catch(err=>{
        log.error(err)
        res.status(500).send({message:'Error al verificar el número de documento'})
    })

}

const logObreroActual = (req,res,next) => {
    const id = req.params.id;

    try{
        tablasgeneralesController.obtenerObrero(id)
        .then(respuesta=>{

            if (respuesta.recordset.length===0){
                res.status(404).send({message:'El obrero con id ' + id + ' no existe. No se puede actualizar'})
                return
            }

            const obrero = respuesta.recordset[0]
            log.info(`Backup del obrero ${id} antes de actualizar sus datos. ${JSON.stringify(obrero)}`)
            next()
        })
        .catch(err => {
            log.error(err)
            res.status(500).send({message:'Error al ejecutar respaldo de datos del obrero antes de actualizarlo. Ver log'})
        })
    }catch(err){

    }
}

const logIglesiaActual = (req,res,next) => {
    const id = req.params.id;

    try{
        tablasgeneralesController.obtenerIglesia(id)
        .then(respuesta=>{

            if (respuesta.recordset.length===0){
                res.status(404).send({message:'La iglesia con id ' + id + ' no existe. No se puede actualizar'})
                return
            }

            const iglesia = respuesta.recordset[0]
            log.info(`Backup de la iglesia ${id} antes de actualizar sus datos. ${JSON.stringify(iglesia)}`)
            next()
        })
        .catch(err => {
            log.error(err)
            res.status(500).send({message:'Error al ejecutar respaldo de datos de la iglesia antes de actualizarlo. Ver log'})
        })
    }catch(err){

    }
}

tablasgeneralesRouter.get('/obreros/:id_region',procesarErrores((req,res)=>{
    const id_region = req.params.id_region;
    return tablasgeneralesController.obtenerObreros(id_region)
    .then(materias=>{
        const formateo = materias.recordset.map(item=>{return {...item,ult_ascenso:item.ult_ascenso ? fechas.transformarIso8601(item.ult_ascenso):''}})
        res.status(200).json(formateo)
    })
}))

tablasgeneralesRouter.get('/iglesiasobreroOLD/:id_obrero',jwtAuthenticate,procesarErrores((req,res)=>{
    const id_obrero = req.params.id_obrero;
    return tablasgeneralesController.obtenerIglesiasPorObrero(id_obrero)
    .then(iglesias=>{
        res.status(200).json(iglesias.recordset)
    })
}))

tablasgeneralesRouter.get('/iglesiasobrero/:id_obrero',jwtAuthenticate,procesarErrores((req,res)=>{

        res.status(200).json(iglesiasjson)
}))



tablasgeneralesRouter.get('/iglesiasobreroall/:id_obrero',jwtAuthenticate,procesarErrores((req,res)=>{
    const id_obrero = req.params.id_obrero;
    return tablasgeneralesController.obtenerIglesiasPorObreroCompleto(id_obrero)
    .then(iglesias=>{
        res.status(200).json(iglesias.recordset)
    })
}))

tablasgeneralesRouter.get('/iglesias/:id_region/:id_per_fiscal',procesarErrores((req,res)=>{
    const id_region = req.params.id_region;
    const id_per_fiscal = req.params.id_per_fiscal;

    return tablasgeneralesController.obtenerIglesias(id_region,id_per_fiscal)
    .then(materias=>{
        res.status(200).json(materias.recordset)
    })
}))

tablasgeneralesRouter.get('/estadisticas/iglesias/:id_region',jwtAuthenticate,procesarErrores((req,res)=>{
    const id_region = req.params.id_region;
    return tablasgeneralesController.obtenerEstadisticasIglesias(Number(id_region))
    .then(estadisticas=>{
        res.status(200).json(estadisticas.recordset)
    })
}))

tablasgeneralesRouter.get('/estadisticas/obreros/:id_region',jwtAuthenticate,procesarErrores((req,res)=>{
    const id_region = req.params.id_region;
    return tablasgeneralesController.obtenerEstadisticasObreros(Number(id_region))
    .then(estadisticas=>{
        res.status(200).json(estadisticas.recordset)
    })
}))

tablasgeneralesRouter.get('/credenciales/:id_region/:estado',jwtAuthenticate,procesarErrores((req,res)=>{
    const id_region = req.params.id_region;
    const estado_credencial = req.params.estado;

    return tablasgeneralesController.obtenerCredenciales(id_region,estado_credencial)
    .then(materias=>{
        const formateo = materias.recordset.map(item=>{return {...item,f_solicitud:fechas.transformarIso8601(item.f_solicitud)}})

        res.status(200).json(formateo)
    })
}))

tablasgeneralesRouter.put('/credenciales/autorizacion/:id',[jwtAuthenticate],procesarErrores((req,res)=>{

    const solicitud = req.body;
    const id = req.params.id;

    log.info(JSON.stringify(solicitud))

    return tablasgeneralesController.grabarOperacionCredencial(id,solicitud)
    .then((respuesta)=>{
        res.status(200).json(respuesta)
        }
    )
}))

tablasgeneralesRouter.get('/permisosusuario',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerPermisosUsuarios()
    .then(permisos=>{
        res.status(200).json(permisos.recordset)
    })
}))

tablasgeneralesRouter.get('/tiposusuario',jwtAuthenticate,procesarErrores((req,res)=>{

    return tablasgeneralesController.obtenerTiposUsuarios()
    .then(tipos=>{
        res.status(200).json(tipos.recordset)
    })
}))

tablasgeneralesRouter.get('/paises',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerPaises()
    .then(paises=>{
        res.status(200).json(paises.recordset)
    })
}))

tablasgeneralesRouter.get('/provincias/all',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerProvinciasAll()
    .then(provincias=>{
        res.status(200).json(provincias.recordset)
    })
}))

tablasgeneralesRouter.get('/nacionalidades',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerNacionalidades()
    .then(nacionalidades=>{
        res.status(200).json(nacionalidades.recordset)
    })
}))

tablasgeneralesRouter.get('/dias',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerDias()
    .then(tipos=>{
        res.status(200).json(tipos.recordset)
    })
}))

tablasgeneralesRouter.post('/credenciales/solicitarimpresion',jwtAuthenticate,procesarErrores((req,res)=>{
    const {id_obrero,imp_anual} = req.body;

    return tablasgeneralesController.solicitarImpresionCredencial(id_obrero,imp_anual)
    .then(respuesta=>{
        res.status(200).json(respuesta.recordset[0])
    })
}))

tablasgeneralesRouter.get('/periodosfiscales',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerPeriodosFiscales()
    .then(periodos=>{
        res.status(200).json(periodos.recordset)
    })
}))

tablasgeneralesRouter.get('/instrumento/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;

    return tablasgeneralesController.obtenerInstrumento(id)
    .then(instrumento=>{
        res.status(200).json(instrumento.recordset[0])
    })
}))

tablasgeneralesRouter.put('/obrero/:id',[jwtAuthenticate,validarObrero,logObreroActual],procesarErrores((req,res)=>{

    const datos = req.body;
    const id = req.params.id;

    log.info(`Detalle de la modificación del obrero ${id} - ${JSON.stringify(datos)}`)

    return tablasgeneralesController.actualizarObrero(id,datos)
    .then((respuesta)=>{
        log.info(`Se modifica el obrero ${id}`);
        res.status(200).send("ok")
        }
    )
}))

tablasgeneralesRouter.post('/obrero/',[jwtAuthenticate,validarObrero, verificarNroDocumentoObrero],procesarErrores((req,res)=>{

    const datos = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;;

    log.info(`Alta de un nuevo obrero ${JSON.stringify(datos)}`)

    return tablasgeneralesController.crearObrero(datos,ip)
    .then((respuesta)=>{
        log.info(`Se crea el obrero ${respuesta.recordset[0].id_obrero}`);
        res.status(200).json({id_obrero:respuesta.recordset[0].id_obrero})
        }
    )
}))

tablasgeneralesRouter.put('/iglesia/:id',[jwtAuthenticate,validarIglesia,logIglesiaActual],procesarErrores((req,res)=>{

    const datos = req.body;
    const id = req.params.id;

    log.info(`Detalle de la modificación de la iglesia ${id} - ${JSON.stringify(datos)}`)

    return tablasgeneralesController.actualizarIglesia(id,datos)
    .then((respuesta)=>{
        log.info(`Se modifica la iglesia ${id}`);
        res.status(200).send("ok")
        }
    )
}))


tablasgeneralesRouter.post('/iglesia/',[jwtAuthenticate,validarIglesia],procesarErrores((req,res)=>{

    const datos = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;;

    log.info(`Alta de una nueva iglesia ${JSON.stringify(datos)}`)

    return tablasgeneralesController.crearIglesia(datos,ip)
    .then((respuesta)=>{
        log.info(`Se crea la iglesia ${respuesta.recordset[0].id_iglesia}`);
        res.status(200).json({id_iglesia:respuesta.recordset[0].id_iglesia})
        }
    )
}))

tablasgeneralesRouter.get('/iglesia/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id = req.params.id;
    return tablasgeneralesController.obtenerIglesia(id)
    .then(iglesia=>{
        res.status(200).json(iglesia.recordset)
    })
}))

tablasgeneralesRouter.get('/estadosciviles',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerEstadosCiviles()
    .then(estciviles=>{
        res.status(200).json(estciviles.recordset)
    })
}))

tablasgeneralesRouter.get('/tiposdocumento',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerTiposDocumento()
    .then(tdocumentos=>{
        res.status(200).json(tdocumentos.recordset)
    })
}))

tablasgeneralesRouter.get('/rangos/',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerRangos()
    .then(rangos=>{
        res.status(200).json(rangos.recordset)
    })
}))
tablasgeneralesRouter.get('/regiones',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerRegiones()
    .then(regiones=>{
        res.status(200).json(regiones.recordset)
    })
}))
tablasgeneralesRouter.get('/provincias',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerProvincias()
    .then(provincias=>{
        res.status(200).json(provincias.recordset)
    })
}))
tablasgeneralesRouter.get('/tiposiglesias',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerTiposIglesias()
    .then(tiposiglesias=>{
        res.status(200).json(tiposiglesias.recordset)
    })
}))

tablasgeneralesRouter.get('/listado/obreros',jwtAuthenticate,procesarErrores((req,res)=>{
    return tablasgeneralesController.obtenerListadoObrerosSimple()
    .then(obreros=>{
        res.status(200).json(obreros.recordset)
    })
}))

tablasgeneralesRouter.get('/obrero/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id = req.params.id;
    return tablasgeneralesController.obtenerObrero(id)
    .then(obrero=>{
        res.status(200).json(obrero.recordset)
    })
}))

tablasgeneralesRouter.get('/mesesdiezmadosOLD/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;

    return tablasgeneralesController.obtenerMesesDiezmados(id)
    .then(meses=>{
        res.status(200).json(meses.recordset)
    })
}))

tablasgeneralesRouter.get('/mesesdiezmados/:id',procesarErrores((req,res)=>{

     res.status(200).json(mesesdjson)
}))



tablasgeneralesRouter.get('/balances/:id',jwtAuthenticate,procesarErrores((req,res)=>{
    const id=req.params.id;

    return tablasgeneralesController.obtenerBalances(id)
    .then(balances=>{
        res.status(200).json(balances.recordset)
    })
}))


tablasgeneralesRouter.get('/ingresosOLD/:id_region/:mes_d/:mes_h/:anio_d/:anio_h/:dia_d/:dia_h',procesarErrores((req,res)=>{
    const id_region=req.params.id_region;
    const mes_d=req.params.mes_d;
    const mes_h=req.params.mes_h;
    const anio_d=req.params.anio_d;
    const anio_h=req.params.anio_h;
    const dia_d=req.params.dia_d;
    const dia_h=req.params.dia_h;

    return tablasgeneralesController.obtenerIngresos(id_region,mes_d,mes_h,anio_d,anio_h,dia_d,dia_h)
    .then(ingresos=>{
        const formateo = ingresos.recordset.map(item=>{return {...item,fecha:fechas.transformarIso8601(item.fecha)}})
        res.status(200).json(formateo)
    })
}))

tablasgeneralesRouter.get('/ingresos/:id_region/:mes_d/:mes_h/:anio_d/:anio_h/:dia_d/:dia_h',procesarErrores((req,res)=>{
    const id_region=req.params.id_region;
    const mes_d=req.params.mes_d;
    const mes_h=req.params.mes_h;
    const anio_d=req.params.anio_d;
    const anio_h=req.params.anio_h;
    const dia_d=req.params.dia_d;
    const dia_h=req.params.dia_h;

    res.status(200).json(ingresosjson)

}))

storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,path.join(__dirname,'/../../../uploads'))
    },
    filename:(req,file,callback)=>{
        req.body.nombreArchivo = file.originalname;
        callback(null,Date.now() + '-' +file.originalname)
    }
})

const upload = multer({storage}).single('adjunto')
// multer me agrega a la solicitud el archivo y lo puedo leer como req.file luego de ser procesado por multer

const validarMail = (req,res,next)=>{
    const { mensaje, asunto, nombreArchivo } = req.body;

    if (mensaje.trim()==="" || asunto.trim()===""){
        throw new Error("El mensaje o el asunto son campos obligatorios")
        return
    }

    if (req.file){
        const archivo = req.file;
        const size = archivo.size / 1024 /1024;

        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(archivo.mimetype)) {
            throw new Error("El tipo de archivo es incorrecto. Solo se aceptan documentos pdf o imágenes")
            return
        }

        if (size > 5) {
            throw new Error("El archivo excede los 5MG")
            return
        }
    }

    next()
}

tablasgeneralesRouter.post('/enviarmail',upload,validarMail,async (req,res)=>{
    const { mensaje, asunto, destinatarios, cc, bcc, nombreArchivo, usuario, id_region } = req.body;

    log.info(`Mail enviado por el usuario ${usuario} Region ${id_region} asunto ${asunto} y mensaje ${mensaje} a los destinatarios ${destinatarios} con archivo ${req.file ? JSON.stringify(req.file) : ' sin archivo'}`)

    const transporter = nodemailer.createTransport({
        host:'xxx.xxx-smpt.xxx',
        port:2525,
        secure:false,
        auth:{
            user:'noresponder@xxx.xxx.xxx',
            pass:'xxxxx'
        },
        tls:{
            rejectUnauthorized:false
        }
    })

    const mensaje_con_firma = 
`${mensaje}


Mail enviado desde el sistema administrativo UAD - Region ${id_region}
` 
   
const firma = `"Ejemplo - Ejemplo ${id_region}"`

    try{
        const respuesta = await transporter.sendMail({
            from:`${firma} <ejemplo@uad.org.ar>`,
            subject: asunto,
            text:mensaje_con_firma,
            bcc:destinatarios,
            attachments: req.file ? [{
                filename: nombreArchivo,
                path: req.file.path
           }] : null
        })

        res.status(200).json(respuesta)
    }catch(err){
        log.error(err)
        res.status(500).send('El servidor de correo no se encuentra operativo en este ejemplo por razones de seguridad');

    }

})


module.exports = tablasgeneralesRouter;

