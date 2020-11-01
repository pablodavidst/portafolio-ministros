
const { sql,poolPromise } = require('./../../../database/db')
const {ErrorDeBaseDeDatos} = require('./tablasgenerales.errors');
const procesarErrores = require('./../../libs/errorHandler').procesarErrores;
const log = require('../../../utils/logger');
const dbconfig = require('./../../../config').dbconfig;
const utilFechas = require('../../../utils/fechas')

async  function obtenerBalances(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('id_iglesia', sql.Int, id)
        .execute('spWebListarBalances')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerIngresos(id_region,mes_d,mes_h,anio_d,anio_h,dia_d,dia_h){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('id_region', sql.Int, id_region)
        .input('mes_desde', sql.Int, mes_d)
        .input('mes_hasta', sql.Int, mes_h)
        .input('anio_desde', sql.Int, anio_d)
        .input('anio_hasta', sql.Int, anio_h)
        .input('dia_desde', sql.Int, dia_d)
        .input('dia_hasta', sql.Int, dia_h)

        .execute('spWebListarIngresosCDNv2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerMesesDiezmados(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('id_iglesia', sql.Int, id)
        .execute('spWebListarMesesDiezmados')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerIglesiasPorObrero(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('id_obrero', sql.Int, id)
        .execute('spWebListarIglesiasPorObreroV2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerIglesiasPorObreroCompleto(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('id_obrero', sql.Int, id)
        .execute('spWebListarIglesiasPorObreroCompletoV2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}



async  function solicitarImpresionCredencial(id,imp_anual){
    try{
        const pool = await poolPromise
        
        log.info(`datos que llegan ${id} - ${imp_anual}`)
        return pool.request() 
        .input('id_obrero', sql.Int, id)
        .input('impresion_anual', sql.Bit, imp_anual)
        .execute('spWebSolicitarImpresionV2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerObreros(id_region){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('id_region', sql.Int, id_region)
        .execute('spWebListarObrerosRegionesV2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerPeriodosFiscales(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .execute('spWebListarAnioFiscalV2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerIglesias(id_region,id_per_fiscal){
    try{
        const pool = await poolPromise
        const id_fiscal = id_per_fiscal ? id_per_fiscal : 12;

        return pool.request() 
        .input('id_region', sql.Int, id_region)
        .input('id_año_fiscal', sql.Int, id_fiscal)
        .execute('spWebListarIglesiasRegionesV2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerEstadisticasIglesias(id_region){
    try{
        const pool = await poolPromise

        return pool.request() 
        .input('id_region', sql.Int, id_region)
        .execute('spWebListarEstadisticasIglesiasRegionesV2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerEstadisticasObreros(id_region){
    try{
        const pool = await poolPromise

        return pool.request() 
        .input('id_region', sql.Int, id_region)
        .execute('spWebListarEstadisticasObrerosRegionesV2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async function grabarOperacionCredencial(id,solicitud){

    try {
        const pool = await poolPromise

        return pool.request() 
        .input('id_solicitud', sql.Int, id)
        .input('observacion', sql.NVarChar, solicitud.observacion)
        .input('resp_autorizacion', sql.NVarChar, solicitud.responsable)
        .input('autorizado_reg', sql.Bit, solicitud.autorizado)
        .execute('spWebAutorizarSolicitudImpresionV2')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function actualizarIglesia(id,datos){

    try {
        const pool = await poolPromise

        return pool.request() 
        .input('id_iglesia', sql.Int, id)
        .input('direccion', sql.NVarChar, datos.direccion)
        .input('barrio', sql.NVarChar, datos.barrio)
        .input('cod_postal', sql.NVarChar, datos.cod_postal)
        .input('localidad', sql.NVarChar, datos.localidad)
        .input('id_provincia', sql.Int, datos.id_provincia)
        .input('telefono', sql.NVarChar, datos.telefono)
        .input('fax', sql.NVarChar, datos.fax)
        .input('pag_web', sql.NVarChar, datos.pag_web)
        .input('cant_miembros', sql.Int, datos.cant_miembros)
        .input('fich_culto', sql.Bit, datos.fich_culto)
        .input('libro_cont', sql.Bit, datos.libro_cont)
        .input('seguro', sql.Bit, datos.seguro)
        .input('hab_municip', sql.Bit, datos.hab_municip)
        .input('dispensario', sql.Bit, datos.dispensario)
        .input('comedor', sql.Bit, datos.comedor)
        .input('colegio', sql.Bit, datos.colegio)
        .input('rehabilit', sql.Bit, datos.rehabilit)
        .input('hogar_niños', sql.Bit, datos.hogar_niños)
        .input('predio_recreat', sql.Bit, datos.predio_recreat)
        .input('id_pastor_uad', sql.Int, datos.id_pastor_UAD)
        .input('id_encargado_uad', sql.Int, datos.id_encargado_UAD)
        .input('nombre', sql.NVarChar, datos.nombre_iglesia)
        .input('pastor', sql.NVarChar, datos.nombre_pastor)
        .input('encargado', sql.NVarChar, datos.nombre_encargado)

        .execute('spWebActualizarIglesiaV2')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function crearIglesia(datos,ip){
    try {
        const pool = await poolPromise

        return pool.request() 
        .input('id_iglesia', sql.Int, null)
        .input('direccion', sql.NVarChar, datos.direccion)
        .input('barrio', sql.NVarChar, datos.barrio)
        .input('cod_postal', sql.NVarChar, datos.cod_postal)
        .input('localidad', sql.NVarChar, datos.localidad)
        .input('id_provincia', sql.Int, datos.id_provincia)
        .input('telefono', sql.NVarChar, datos.telefono)
        .input('fax', sql.NVarChar, datos.fax)
        .input('cant_miembros', sql.Int, datos.cant_miembros)
        .input('fich_culto', sql.Bit, datos.fich_culto)
        .input('libro_cont', sql.Bit, datos.libro_cont)
        .input('seguro', sql.Bit, datos.seguro)
        .input('hab_municip', sql.Bit, datos.hab_municip)
        .input('dispensario', sql.Bit, datos.dispensario)
        .input('comedor', sql.Bit, datos.comedor)
        .input('colegio', sql.Bit, datos.colegio)
        .input('rehabilit', sql.Bit, datos.rehabilit)
        .input('hogar_niños', sql.Bit, datos.hogar_niños)
        .input('predio_recreat', sql.Bit, datos.predio_recreat)
        .input('pag_web', sql.NVarChar, datos.pag_web)
        .input('nombre_pastor', sql.NVarChar, datos.nombre_pastor)
        .input('nombre_encargado', sql.NVarChar, datos.nombre_encargado)
        .input('id_pastor_UAD', sql.Int, datos.id_pastor_UAD)
        .input('id_encargado_uad', sql.Int, datos.id_encargado_UAD)
        .input('id_usuario', sql.Int, datos.id_usuario)
        .input('id_region', sql.Int, datos.id_region)
        .input('nombre_iglesia', sql.NVarChar, datos.nombre_iglesia)
        .input('ip_maq', sql.VarChar, ip)
        .execute('spWebInsActIglesia_new')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function actualizarObrero(id,datos){
    const {dia,mes,anio} = datos;

    const fecha_nacimiento = utilFechas.transformarDiaMesAnioAfechaSQL(dia,mes,anio)

    try {
        const pool = await poolPromise

        return pool.request() 
        .input('id_obrero', sql.Int, id)
        .input('conyuge', sql.NVarChar, datos.conyuge)
        .input('direccion', sql.NVarChar, datos.direccion)
        .input('barrio', sql.NVarChar, datos.barrio)
        .input('cod_postal', sql.NVarChar, datos.cod_postal)
        .input('localidad', sql.NVarChar, datos.localidad)
        .input('id_provincia', sql.Int, datos.id_provincia)
        .input('telefono', sql.NVarChar, datos.telefono)
        .input('celular', sql.NVarChar, datos.celular)
        .input('email', sql.NVarChar, datos.email)
        .input('id_estado_civil', sql.Int, datos.id_estado_civil)
        .input('pastor', sql.Bit, datos.pastor)
        .input('maestro', sql.Bit, datos.maestro)
        .input('evangelista', sql.Bit, datos.evangelista)
        .input('misionero', sql.Bit, datos.misionero)
        .input('otro', sql.Bit, datos.otro)
        .input('oficio', sql.NVarChar, datos.oficio)
        .input('desc_ministerio', sql.NVarChar, datos.desc_ministerio)
        .input('nombre_pst_resp', sql.NVarChar, datos.nombre_pst_resp)
        .input('contacto_pst_resp', sql.NVarChar, datos.contacto_pst_resp)
        .input('nombre_igl_resp', sql.NVarChar, datos.nombre_igl_resp)
        .input('id_tipo_doc', sql.Int, datos.id_tipo_doc)
        .input('nro_documento', sql.Int, datos.nro_documento)
        .input('contacto_igl_resp', sql.NVarChar, datos.contacto_igl_resp)

        .execute('spWebActualizarObreroV2')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async function crearObrero(datos,ip){
    const {dia,mes,anio} = datos;

    const fecha_nacimiento = utilFechas.transformarDiaMesAnioAfechaSQL(dia,mes,anio)

    try {
        const pool = await poolPromise

        return pool.request() 
        .input('id_obrero', sql.Int, null)
        .input('conyuge', sql.NVarChar, datos.conyuge)
        .input('direccion', sql.NVarChar, datos.direccion)
        .input('barrio', sql.NVarChar, datos.barrio)
        .input('cod_postal', sql.NVarChar, datos.cod_postal)
        .input('localidad', sql.NVarChar, datos.localidad)
        .input('id_provincia', sql.Int, datos.id_provincia)
        .input('telefono', sql.NVarChar, datos.telefono)
        .input('celular', sql.NVarChar, datos.celular)
        .input('email', sql.NVarChar, datos.email)
        .input('id_estado_civil', sql.Int, datos.id_estado_civil)
        .input('pastor', sql.Bit, datos.pastor)
        .input('maestro', sql.Bit, datos.maestro)
        .input('evangelista', sql.Bit, datos.evangelista)
        .input('misionero', sql.Bit, datos.misionero)
        .input('otro', sql.Bit, datos.otro)
        .input('oficio', sql.NVarChar, datos.oficio)
        .input('desc_ministerio', sql.NVarChar, datos.desc_ministerio)
        .input('nombre_pst_resp', sql.NVarChar, datos.nombre_pst_resp)
        .input('contacto_pst_resp', sql.NVarChar, datos.contacto_pst_resp)
        .input('nombre_igl_resp', sql.NVarChar, datos.nombre_igl_resp)
        .input('contacto_igl_resp', sql.NVarChar, datos.contacto_igl_resp)
        .input('id_usuario', sql.Int, datos.id_usuario)
        .input('id_region', sql.Int, datos.id_region)
        .input('nombre', sql.NVarChar, datos.nombre)
        .input('f_nac', sql.VarChar, fecha_nacimiento)
        .input('ip_maq', sql.VarChar, ip)
        .input('sexo', sql.VarChar, datos.sexo)
        .input('id_tipo_doc', sql.Int, datos.id_tipo_doc)
        .input('nro_documento', sql.Int, datos.nro_documento)
        .input('id_nacionalidad', sql.Int, datos.id_nacionalidad)
        .input('id_tipo_doc', sql.Int, datos.id_tipo_doc)
        .input('nro_documento', sql.Int, datos.nro_documento)        
        .execute('spWebInsActObreroV2')

    }catch(err){
        log.error('se produjo un error '+ err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerCredenciales(id_region,estado_credencial){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('id_region', sql.Int, id_region)
        .input('estado_credencial', sql.Int, estado_credencial)
        .execute('spWebListarSolicitudesImpresionRegionV2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function verificarNroDocumento(nro_documento){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('nro_documento', sql.Int, nro_documento)
        .execute('spWebVerificarNroDocumento_new')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerIglesia(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('id_iglesia', sql.Int, id)
        .execute('spWebCargarIglesiaV2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerObrero(id){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .input('id_obrero', sql.Int, id)
        .execute('spWebCargarObreroV2')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async  function obtenerTiposUsuarios(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarTiposDeUsuarios')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerPermisosUsuarios(){
    try{
        const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarPermisos')
    }catch{
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerPaises(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarPaises')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerDias(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarDias')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerPaises(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spListarPaises ')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerProvinciasAll(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .input('NroPais', sql.Int,-1)
        .execute('spListarProvinciasSegunPais_new')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerNacionalidades(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spWebListarNacionalidades')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerEstadosCiviles(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spWebListarEstadosCiviles')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerTiposDocumento(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spWebListarTipoDocumentos')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


async  function obtenerRangos(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spWebListarRangos')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerRegiones(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spWebListarRegiones')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerProvincias(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spWebListarProvincias')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerTiposIglesias(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spWebListarTipoIglesias')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}

async  function obtenerListadoObrerosSimple(){
    try{
         const pool = await poolPromise
        
        return pool.request() 
        .execute('spWebListarObreroSimpleV2')
    }catch(err){
        log.error(err.stack + err.message)
        throw new ErrorDeBaseDeDatos()
    }
}


module.exports={
    obtenerDias,
    obtenerPaises,
    obtenerProvinciasAll,
    obtenerNacionalidades,
    obtenerTiposUsuarios,
    obtenerPermisosUsuarios,
    obtenerObreros,
    obtenerIglesias,
    obtenerCredenciales,
    grabarOperacionCredencial,
    actualizarIglesia,
    actualizarObrero,
    obtenerIglesia,
    obtenerObrero,
    obtenerEstadosCiviles,
    obtenerRangos,
    obtenerRegiones,
    obtenerProvincias,
    obtenerTiposIglesias,
    crearObrero,
    obtenerTiposDocumento,
    verificarNroDocumento,
    crearIglesia,
    actualizarIglesia,
    obtenerListadoObrerosSimple,
    obtenerPeriodosFiscales,
    obtenerBalances,
    obtenerMesesDiezmados,
    obtenerIngresos,
    obtenerEstadisticasIglesias,
    obtenerEstadisticasObreros,
    obtenerIglesiasPorObrero,
    solicitarImpresionCredencial,
    obtenerIglesiasPorObreroCompleto
}