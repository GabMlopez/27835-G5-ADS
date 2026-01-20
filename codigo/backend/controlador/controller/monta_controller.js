const monta_servicio = require('../servicios/monta_servicio');

exports.create_reproduccion = async (req, res) => {
    try{
        const datos = req.body;
        await monta_servicio.crear_reproduccion(datos);
        
        res.status(201).json({message: 'Monta creada exitosamente'});
    }catch(error){
        res.status(400).json({error: error.message});
    }
};

exports.get_reproducciones = async (req, res) => {
    try{
        const reproducciones = await monta_servicio.obtener_reproducciones();
        if(reproducciones ===null){
            res.status(400).json({
                message:'No existen reproducciones registradas'
            });
        } 
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
        if(reproducciones === null){
            res.status(400).json({
                message:'No existen reproducciones registradas para este conejo'
            });
        } 
        res.status(200).json(reproducciones);
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
};

exports.get_reproduccion_por_id = async (req, res) => {
    try{
        const  reproduccion_id  = req.params.id;
        const reproduccion = await monta_servicio.obtener_reproduccion_por_id(reproduccion_id);
        if(!reproduccion){
            return  res.status(404).json({message: 'Monta no encontrada'});
        }
        res.status(200).json(reproduccion);
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
};