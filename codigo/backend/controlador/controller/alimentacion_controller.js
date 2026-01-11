const alimentacion_servicio = require('../servicios/alimentacion_servicio')

const crear_alimentacion = async (req, res) => {
    try{
        const datos = req.body;
        const nueva_alimentacion = await alimentacion_servicio.crear_alimentacion(datos);
        res.status(200).json({
            message: 'Registro de alimentación creado exitosamente',
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Error al crear el registro de alimentación'
        });
    }
};

const actualizar_alimentacion = async (req,res) =>{
    try{
        const datos = req.body;
        const cambio_alimentacion = await alimentacion_servicio.actualizar_alimentacion(datos);
        res.status(200).json({
            message:'Registro de alimentación cambiado correctamente', 
        })
    }catch{

    }
}
const obtener_alimentaciones_por_conejo = async (req, res) => {
    try {
        const conejo_id = req.params.conejo_id;
        const alimentaciones = await alimentacion_servicio.obtener_alimentaciones_por_conejo(conejo_id);
        res.status(200).json(alimentaciones);
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'Error al obtener los registros de alimentación'
        });
    }
};

const obtener_alimentacion_por_id = async (req, res) => {
    try {
        const alimentacion_id = req.params.id;
        const alimentacion = await alimentacion_servicio.obtener_alimentacion_por_id(alimentacion_id);
        if (!alimentacion) {
            return res.status(404).json({ message: 'Registro de alimentación no encontrado' });
        }
        res.status(200).json(alimentacion);
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Error al obtener el registro de alimentación'
        });
    }
};
const alimentacion_controller = {
    crear_alimentacion,
    obtener_alimentaciones_por_conejo,
    obtener_alimentacion_por_id,
    actualizar_alimentacion
};

module.exports = alimentacion_controller;