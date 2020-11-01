const Joi = require('joi');
const log = require('../../../utils/logger');
const tablasgeneralesController = require('../tablasgenerales/tablasgenerales.controller')
const utilFechas = require('../../../utils/fechas')

const bluePrintAula = Joi.object().keys(
     {
        nombre:Joi.string().max(20).required(),
      }
)

const bluePrintCuatrimestre = Joi.object().keys(
    {
        nombre:Joi.string().max(25).required(),
        activo:Joi.boolean().required(),
        dia_i:Joi.number().min(1).max(31).integer().required(),
        mes_i:Joi.number().min(1).max(12).integer().required(),
        anio_i:Joi.number().min(aniosPermitidos().desde).max(aniosPermitidos().hasta).integer().required(),
        dia_f:Joi.number().min(1).max(31).integer().required(),
        mes_f:Joi.number().min(1).max(12).integer().required(),
        anio_f:Joi.number().min(aniosPermitidos().desde).max(aniosPermitidos().hasta).integer().required()
     }
)

const bluePrintMateria = Joi.object().keys(
    {
        nombre:Joi.string().max(50).required(),
        codigo:Joi.string().max(4).required(),
        id_encabezado:Joi.number().min(1).integer().required(),
        id_regimen:Joi.number().min(1).integer().required(),
        clase_individual:Joi.boolean().required(),
        multiple_inscripcion:Joi.boolean().required(),
        capacidad:Joi.number().min(1).max(99).integer().required(),
        creditos:Joi.number().min(0).max(10).integer().required()
     }
)

const bluePrintInstrumento = Joi.object().keys(
    {
        nombre:Joi.string().max(20).required(),
        abreviatura:Joi.string().max(3).required(),
      }
)

let validarAula = (req,res,next)=>{
    const resultado = Joi.validate(req.body,bluePrintAula,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send(erroresDeValidacion)
    }
}

let validarInstrumento = (req,res,next)=>{
    const resultado = Joi.validate(req.body,bluePrintInstrumento,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send(erroresDeValidacion)
    }
}

let validarCuatrimestre = (req,res,next)=>{
    const resultado = Joi.validate(req.body,bluePrintCuatrimestre,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send(erroresDeValidacion)
    }
}

const bluePrintObrero = Joi.object().keys(
    {
        nombre:Joi.string().max(100).required(),
        conyuge:Joi.string().max(100).allow(''),
        direccion:Joi.string().max(500).allow(''),
        localidad:Joi.string().max(500).allow(''),
        barrio:Joi.string().max(500).allow(''),
        cod_postal:Joi.string().max(10).allow(''),
        telefono:Joi.string().max(500).allow(''),
        celular:Joi.string().max(100).allow(''),
        email:Joi.string().max(100).allow(''),
        oficio:Joi.string().max(100).allow(''),
        desc_ministerio:Joi.string().max(200).allow(''),
        nombre_pst_resp:Joi.string().max(300).allow(''),
        contacto_pst_resp:Joi.string().max(500).allow(''),
        nombre_igl_resp:Joi.string().max(300).allow(''),
        contacto_igl_resp:Joi.string().max(500).allow(''),
        id_estado_civil:Joi.number().min(0).integer().required(),
        id_provincia:Joi.number().integer().required(),
        pastor:Joi.boolean().required(),
        maestro:Joi.boolean().required(),
        evangelista:Joi.boolean().required(),
        misionero:Joi.boolean().required(),
        otro:Joi.boolean().required(),
        id_nacionalidad:Joi.number().min(0).integer().required(),
        id_region:Joi.number().min(0).max(4).integer().required(),
        id_rango:Joi.number().min(0).max(7).integer().required(),
        dia:Joi.number().min(1).max(31).integer().required(),
        mes:Joi.number().min(1).max(12).integer().required(),
        anio:Joi.number().min(1920).max(2020).integer().required(),
        sexo:Joi.string().valid(['M','F']).required(),
        id_tipo_doc:Joi.number().min(0).integer(),
        nro_documento:Joi.number().min(1000000).max(99999999).required('El número de documento es un dato requerido'),
        id_usuario:Joi.number().integer().required(),
     }
)

let validarObrero = (req,res,next)=>{
    const resultado = Joi.validate(req.body,bluePrintObrero,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send(erroresDeValidacion)
    }
}

const bluePrintIglesia = Joi.object().keys(
    {
        direccion:Joi.string().max(1000).allow(''),
        localidad:Joi.string().max(200).required(),
        barrio:Joi.string().max(200).allow(''),
        cod_postal:Joi.string().max(20).allow(''),
        telefono:Joi.string().max(200).allow(''),
        fax:Joi.string().max(200).allow(''),
        pag_web:Joi.string().max(500).allow(''),
        cant_miembros:Joi.number().min(0).integer().required(),
        id_provincia:Joi.number().integer().required(),
        fich_culto:Joi.boolean().required(),
        libro_cont:Joi.boolean().required(),
        seguro:Joi.boolean().required(),
        hab_municip:Joi.boolean().required(),
        dispensario:Joi.boolean().required(),
        comedor:Joi.boolean().required(),
        colegio:Joi.boolean().required(),
        rehabilit:Joi.boolean().required(),
        hogar_niños:Joi.boolean().required(),
        predio_recreat:Joi.boolean().required(),
//        id_pastor_UAD:Joi.number().min(1).integer().required().when('pastor_uad',{is:true,then:Joi.number().min(1).integer().required().label("El pastor es obligatorio"),otherwise:Joi.allow(null)}),
//        id_encargado_UAD:Joi.number().min(1).integer().required().when('encargado_uad',{is:true,then:Joi.number().min(1).integer().required().label("El encargado es obligatorio"),otherwise:Joi.allow(null)}),
        id_pastor_UAD:Joi.number().min(1).integer().required().allow(null),
        id_encargado_UAD:Joi.number().min(1).integer().required().allow(null),
        nombre_pastor:Joi.string().max(200).allow(''),
        nombre_encargado:Joi.string().max(200).allow(''),
        nombre_iglesia:Joi.string().max(200).required(),
        id_tipo_iglesia:Joi.number().integer().required(),
        id_usuario:Joi.number().integer().required(),
        id_region:Joi.number().min(0).max(4).integer().required(),
        //encargado_uad:Joi.boolean().required(),
        //pastor_uad:Joi.boolean().required()
     }
)

let validarIglesia = (req,res,next)=>{
    const resultado = Joi.validate(req.body,bluePrintIglesia,{abortEarly:false,convert:false})

    if (resultado.error===null){
        next()
    }else{
        let erroresDeValidacion = resultado.error.details.reduce((acumulador,error)=>{
            return acumulador + ` ${error.message}` 
        },"")

        res.status(400).send(erroresDeValidacion)
    }
}

async function validarInstrumentoRepetido(req,res,next){
    const {nombre,abreviatura} = req.body;
    const id = req.params.id;

    try{
        const instrumentos = await tablasgeneralesController.obtenerInstrumentos();

        if (id){ // es una modificación
            let datosIguales=instrumentos.recordset.filter(item=>item.nombre.toUpperCase()===nombre.toUpperCase() && item.id_instrumento != id)

            if (datosIguales.length>0){
                res.status(400).send('El nombre del instrumento está en uso')
                return
            }

            datosIguales=instrumentos.recordset.filter(item=>item.abreviatura.toUpperCase()===abreviatura.toUpperCase() && item.id_instrumento != id)
            
            if (datosIguales.length>0){
                res.status(400).send('La abreviatura del instrumento está en uso')
                return
            }

            next()

        }else{ // es una alta
            let datosIguales=instrumentos.recordset.filter(item=>item.nombre.toUpperCase()===nombre.toUpperCase())

            if (datosIguales.length>0){
                res.status(400).send('El nombre del instrumento está en uso')
                return
            }

            datosIguales=instrumentos.recordset.filter(item=>item.abreviatura.toUpperCase()===abreviatura.toUpperCase())
            
            if (datosIguales.length>0){
                res.status(400).send('La abreviatura del instrumento está en uso')
                return
            }

            next()
        }
    }catch(err){
        res.status(500).send(err.message)
    }
}

async function validarCuatrimestreRepetido(req,res,next){
    const {nombre} = req.body;
    const id = req.params.id;

    try{
        const cuatrimestres = await tablasgeneralesController.obtenerCuatrimestres();

        if (id){ // es una modificación
            let datosIguales=cuatrimestres.recordset.filter(item=>item.nombre.toUpperCase()===nombre.toUpperCase() && item.id_cuatrimestre != id)

            if (datosIguales.length>0){
                res.status(400).send('El nombre del cuatrimestre está en uso')
                return
            }

            next()

        }else{ // es una alta
            let datosIguales=cuatrimestres.recordset.filter(item=>item.nombre.toUpperCase()===nombre.toUpperCase())

            if (datosIguales.length>0){
                res.status(400).send('El nombre del cuatrimestre está en uso')
                return
            }

            next()
        }
    }catch(err){
        res.status(500).send(err.message)
    }
}

async function validarAulaRepetida(req,res,next){
    const {nombre} = req.body;
    const id = req.params.id;

    try{
        const aulas = await tablasgeneralesController.obtenerAulas();

        if (id){ // es una modificación
            let datosIguales=aulas.recordset.filter(item=>item.descripcion.toUpperCase()===nombre.toUpperCase() && item.id_aula != id)

            if (datosIguales.length>0){
                res.status(400).send('El nombre del aula está en uso')
                return
            }

            next()

        }else{ // es una alta
            let datosIguales=aulas.recordset.filter(item=>item.descripcion.toUpperCase()===nombre.toUpperCase())

            if (datosIguales.length>0){
                res.status(400).send('El nombre del aula está en uso')
                return
            }

            next()
        }
    }catch(err){
        res.status(500).send(err.message)
    }
}

async function validarMateriaRepetida(req,res,next){
    const {nombre,codigo} = req.body;
    const id = req.params.id;

    try{
        const materias = await tablasgeneralesController.obtenerMaterias();

        if (id){ // es una modificación
            let datosIguales=materias.recordset.filter(item=>item.descripcion.toUpperCase()===nombre.toUpperCase() && item.id_materia != id)

            if (datosIguales.length>0){
                res.status(400).send('El nombre de la materia está en uso')
                return
            }

            datosIguales=materias.recordset.filter(item=>item.cod_materia.toUpperCase()===codigo.toUpperCase() && item.id_materia != id)

            if (datosIguales.length>0){
                res.status(400).send('El código de la materia está en uso')
                return
            }

            next()

        }else{ // es una alta
            let datosIguales=materias.recordset.filter(item=>item.descripcion.toUpperCase()===nombre.toUpperCase())

            if (datosIguales.length>0){
                res.status(400).send('El nombre de la materia está en uso')
                return
            }

            datosIguales=materias.recordset.filter(item=>item.cod_materia.toUpperCase()===codigo.toUpperCase())

            if (datosIguales.length>0){
                res.status(400).send('El código de la materia está en uso')
                return
            }            

            next()
        }
    }catch(err){
        res.status(500).send(err.message)
    }
}

function aniosPermitidos(){
    var fecha_actual = new Date();
    var anio_hasta = Number(fecha_actual.getFullYear()+1);
    var anio_desde = Number(fecha_actual.getFullYear()-50);

    return {desde:anio_desde,hasta:anio_hasta}
}

module.exports = {validarAula,
                  validarAulaRepetida,
                  validarInstrumento,
                  validarCuatrimestre,
                  validarCuatrimestreRepetido,
                  validarInstrumentoRepetido,
                  validarMateriaRepetida,
                  validarObrero,
                  validarIglesia};