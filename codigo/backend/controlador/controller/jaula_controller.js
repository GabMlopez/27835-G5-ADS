const { jaula_servicio } = require('../servicios/jaula_servicio');

exports.createPen = async (req, res) => {
  try {
    const datos = req.body; 

    const nueva_jaula = await jaula_servicio.crear_jaula(datos);

    res.status(201).json({
      message: 'Jaula creada exitosamente',
      jaula: nueva_jaula
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Error al crear la jaula'
    });
  }
};