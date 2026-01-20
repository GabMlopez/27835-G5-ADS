const conejo_servicio = require('../../controlador/servicios/conejo_servicio');

const crear_conejo = async (req, res) => {
    try {
        const datos = req.body;
        const nuevo_conejo = await conejo_servicio.crear_conejo(datos);
        res.status(200).json({
            message: 'Conejo creado exitosamente'
        });
    }catch(error){
        res.status(400).json({
            message: error.message || 'Error al crear el conejo'
        });
    }
};

const obtener_conejos = async (req, res) => {
    try {
        const conejos = await conejo_servicio.obtener_conejos();
        if(conejos ===null){
            res.status(400).json({
                message:'No existe conejos registradas'
            });
        } 
        res.status(200).json(conejos);
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Error al obtener los conejos'
        });
    }
};

const obtener_conejo_por_id = async (req, res) => {
    try {
        const conejo = await conejo_servicio.obtener_conejo_por_id(req.params.id);
        if (!conejo) {
            return res.status(404).json({ message: 'Conejo no encontrado' });
        }
        res.status(200).json(conejo);
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Error al obtener el conejo'
        });
    }
};

const actualizar_conejo = async (req, res) => {
    try {
        const conejo_id = req.params.id;
        const datos_actualizacion = req.body;
        const conejo_actualizado = await conejo_servicio.actualizar_conejo(conejo_id, datos_actualizacion);
        res.status(200).json({
            message: 'Conejo actualizado exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Error al actualizar el conejo'
        });
    }
};

const eliminar_conejo = async (req, res) => {
    try {
        const conejo_id = req.params.id;
        await conejo_servicio.eliminar_conejo(conejo_id);
        res.status(200).json({
            message: 'Conejo eliminado exitosamente'
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message || 'Error al eliminar el conejo'
        });
    }
};

const conejo_controller = {
    crear_conejo,
    obtener_conejos,
    obtener_conejo_por_id,
    actualizar_conejo,
    eliminar_conejo
};
module.exports = conejo_controller;