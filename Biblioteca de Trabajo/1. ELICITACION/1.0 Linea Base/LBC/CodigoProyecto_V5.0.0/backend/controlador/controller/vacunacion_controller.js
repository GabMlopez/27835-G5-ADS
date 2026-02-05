const vacunacion_servicio = require('../servicios/vacunacion_servicio');

const crear_vacunacion_por_conejo = async (req,res) => {
    try{
        const datos = req.body;
        await vacunacion_servicio.crear_vacunacion_para_conejo(datos);
        res.status(201).json({
            message: 'Vacunación creada exitosamente'
        });
    }catch(error){
        res.status(400).json({
        message: error.message || 'Error al crear la vacunacion'
    });
    }
}

const crear_vacunacion_por_jaula= async (req,res) => {
    try{
        const { jaula_id, vacunacion_fecha, vacunacion_tipo } = req.body;

        if (!jaula_id)     return res.status(400).json({ message: "jaula_id es requerido" });
        if (!vacunacion_fecha) return res.status(400).json({ message: "vacunacion_fecha es requerida" });
        if (!vacunacion_tipo)  return res.status(400).json({ message: "vacunacion_tipo es requerido" });

        await vacunacion_servicio.crear_vacunacion_para_jaula(
            jaula_id,
            vacunacion_fecha,
            vacunacion_tipo
        );
        
        res.status(201).json({
            message: 'Vacunaciones creadas exitosamente'
        });
    }catch(error){
        res.status(400).json({
        message: error.message || 'Error al crear las vacunaciones'
    });
    }
    
}

const actualizar_vacunacion= async (req,res) => {
    try{
        const datos = req.body;
        const id = req.params.id;
        await vacunacion_servicio.actualizar_vacunacion(id,datos);
        res.status(201).json({
            message: 'Vacunacion actualizada exitosamente'
        });
    }catch(error){
        res.status(400).json({
        message: error.message || 'Error al actualizar las vacunacion'
    });
    }
    
}

const obtener_vacunacion_por_conejo= async (req,res) => {
    try{
        const id = req.params.id;
        const vacunaciones = await vacunacion_servicio.obtener_vacunaciones_por_conejo(id);
        res.status(200).json({
            vacunaciones
        });
    }catch(error){
        res.status(400).json({
        message: error.message || 'Error al actualizar las vacunacion'
    });
    } 
}

const obtener_vacunaciones_por_id = async (req,res) => {
    try{
        const id = req.params.id;
        const vacunacion = await vacunacion_servicio.obtener_vacunacion_por_id(id);
        res.status(200).json({
            vacunacion
        });
    }catch(error){
        res.status(400).json({
            message: error.message || 'Error al obtener la vacunacion'
        });
    }
}

module.exports = {
    crear_vacunacion_por_conejo,
    crear_vacunacion_por_jaula,
    actualizar_vacunacion,
    obtener_vacunacion_por_conejo,
    obtener_vacunaciones_por_id
}