const desparasitacion_servicio =require('../servicios/desparasitacion_servicio');
const conejo_servicio = require('../servicios/conejo_servicio');
async function crear_desparasitacion(req,res) {
    try{
        const datos = req.body;
        const conejo_existe = await conejo_servicio.obtener_conejo_por_id(datos.conejo_id);
        if(conejo_existe == null){
            res.status(500).json({message: "No existe este conejo para asignar la desparasitación"})
        }
        await desparasitacion_servicio.crear_desparasitacion(datos);
        res.status(200).json({
            message: 'Desparasitación creada exitosamente'
        })
    }catch(error){
        res.status(400).json({
            message: error.message
        });
    }
};

async function crear_desparasitacion_para_jaula(req,res) {
    try{
        const datos = req.body;
        await desparasitacion_servicio.crear_desparasitacion_para_jaula(datos.jaula_id,datos.desparasitacion_fecha, datos.desparasitacion_realizada);
        res.status(200).json({
            message: 'Desparasitación creada exitosamente'
        })
    }catch(error){
        res.status(400).json({
            message: error.message
        });
    }
}

async function  actualizar_desparasitacion(req,res) {
    try{
        const datos = req.body;
        const id = req.params.id;
        await desparasitacion_servicio.actualizar_desparasitacion(id,datos);
         res.status(200).json({
            message: 'Desparasitación para la jaula creada exitosamente'
        })
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
    
}

async function obtener_desparasitacion_por_id(req,res) {
    try{
        const id = req.params.id;
        const desparasitacion = await desparasitacion_servicio.obtener_desparasitacion_por_id(id);
        if(desparasitacion ===null){
            res.status(400).json({
                message:'No existe una desparacistación para este id'
            });
        } 
        res.status(200).json(desparasitacion);
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
}

async function obtener_desparasitaciones_por_conejo(req,res) {
    try{
        const id = req.params.id;
        const desparasitaciones = await desparasitacion_servicio.obtener_desparasitaciones_por_conejo(id);
        if(desparasitaciones ===null){
            res.status(400).json({
                message:'No existe una desparacistación para este id de conejo'
            });
        }  
        res.status(200).json(desparasitaciones);
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
}
module.exports={
    crear_desparasitacion,
    crear_desparasitacion_para_jaula,
    actualizar_desparasitacion,
    obtener_desparasitacion_por_id,
    obtener_desparasitaciones_por_conejo
}