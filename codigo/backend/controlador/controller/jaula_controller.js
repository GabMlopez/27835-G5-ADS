const jaula_servicio = require('../servicios/jaula_servicio');

const createPen = async (req, res) => {
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

const getPens = async (req, res) => {
  try {
    const jaulas = await jaula_servicio.obtener_jaulas();
    res.status(200).json(jaulas);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error al obtener las jaulas'
    });
  }
};

const getPenById = async (req, res) => {
  try {
    const jaula = await jaula_servicio.obtener_jaula_por_id(req.params.id);
    if (!jaula) {
      return res.status(404).json({ message: 'Jaula no encontrada' });
    }
    res.status(200).json(jaula);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error al obtener la jaula'
    });
  }
};

const updatePen = async (req, res) => {
  try {
    const jaula_id = req.params.id;
    const datos_actualizacion = req.body;
    const jaula_actualizada = await jaula_servicio.actualizar_jaula(jaula_id, datos_actualizacion);
    res.status(200).json({
      message: 'Jaula actualizada exitosamente',
      jaula: jaula_actualizada
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Error al actualizar la jaula'
    });
  }
};

const deletePen = async (req, res) => {
  try {
    const jaula_id = req.params.id;
    await jaula_servicio.eliminar_jaula(jaula_id);
    res.status(200).json({
      message: 'Jaula eliminada exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Error al eliminar la jaula'
    });
  }
};

module.exports = {
  createPen,
  getPens,
  getPenById,
  updatePen,
  deletePen
};