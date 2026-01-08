const monta_servicio = require('../servicios/monta_servicio');

exports.create_reproduccion = async (req, res) => {
    try{
        const datos = req.body;
        const nueva_reproduccion = await monta_servicio.crear_reproduccion(datos);
        
        res.status(201).json({message: 'Monta creada exitosamente'});
    }catch(error){
        res.error(400).json({error: error.message});
    }
};

exports.get_reproducciones = async (req, res) => {
    try{
        const reproducciones = await monta_servicio.obtener_reproducciones();
        res.status(200).json(reproducciones);
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
};

exports.get_reproducciones_por_conejo = async (req, res) => {
    try{
        const { conejo_id } = req.params;
        const reproducciones = await monta_servicio.obtener_reproducciones_por_conejo(conejo_id);
        res.status(200).json(reproducciones);
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
};


