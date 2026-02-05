const servicio=require('../servicios/raza_servicio');
const crearRaza = async (req, res)=>{
    try{
        const datos_raza=req.body;
        const nueva_raza=await servicio.crear_raza(datos_raza);
        res.status(201).json({
            mensaje:'Raza creada exitosamente',
            raza:nueva_raza
        });
    } catch (error) {
        res.status(400).json({
            mensaje: error.message || 'Error al crear la raza'
        });
    }
}
const obtenerRazas = async (req, res)=>{
    try{
        const razas=await servicio.obtener_razas();
        if(razas=== null){
            res.status(400).json({
                message:'No existen razas registradas'
            });
        } 
        res.status(200).json(razas);
    } catch (error) {
        res.status(500).json({
            mensaje: error.message || 'Error al obtener las razas'
        });
    }
}
const obtenerRazaPorId = async (req, res)=>{
    try{
        const raza=await servicio.obtener_raza_por_id(req.params.id);
        if(raza === null){
            res.status(400).json({
                message:'No existe información para este ID de raza'
            });
        } 
        res.status(200).json(raza);
    } catch (error) {
        res.status(404).json({
            mensaje: error.message || 'Error al obtener la raza'
        });
    }
}

module.exports={
    crearRaza,
    obtenerRazas,
    obtenerRazaPorId
}