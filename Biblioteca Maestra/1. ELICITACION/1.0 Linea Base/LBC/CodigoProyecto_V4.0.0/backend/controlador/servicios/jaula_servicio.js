const Jaula = require('../../modelos/modelo/jaula');
const Conejo = require('../../modelos/modelo/conejo');
const { Op } = require('sequelize');
const { options } = require('../../main');

function validar_tipo_jaula(tipo) {
  return ['Reproduccion', 'Engorde'].includes(tipo);
}

function validar_capacidad_jaula(capacidad, tipo) {
  if (tipo === 'Reproduccion') {
    return capacidad === 1;
  }
  if (tipo === 'Engorde') {
    return capacidad >= 1 && capacidad <= 6; 
  }
  return false;
}

async function obtener_conejos_en_jaula(jaula_id) {
  return await Conejo.count({
    where: { jaula_id: jaula_id }
  });
}


async function validar_eliminacion_jaula(jaula_id){
  const conejos_en_jaula = await obtener_conejos_en_jaula(jaula_id);
  return (conejos_en_jaula === 0);
}

async function crear_jaula(datos) {
  if (!validar_tipo_jaula(datos.jaula_tipo)) {
    throw new Error('Tipo de jaula inválido. Debe ser Reproduccion o Engorde');
  }

  if (!validar_capacidad_jaula(datos.jaula_capacidad, datos.jaula_tipo)) {
    throw new Error(`Capacidad inválida para jaula de tipo ${datos.jaula_tipo}`);
  }

  return await Jaula.create(datos);
}

async function obtener_jaulas() {
  return await Jaula.findAll({
    order: [['jaula_id', 'ASC']]
  });
}

async function obtener_jaula_por_id(jaula_id) {
  return await Jaula.findByPk(jaula_id);
}

async function actualizar_jaula(jaula_id, datos_actualizacion) {
  const jaula = await obtener_jaula_por_id(jaula_id);
  if (!jaula) {
    throw new Error('Jaula no encontrada');
  }

  if (datos_actualizacion.jaula_tipo && !validar_tipo_jaula(datos_actualizacion.jaula_tipo)) {
    throw new Error('Tipo de jaula inválido');
  }

  if (datos_actualizacion.jaula_capacidad !== undefined) {
    const tipo = datos_actualizacion.jaula_tipo || jaula.jaula_tipo;
    if (!validar_capacidad_jaula(datos_actualizacion.jaula_capacidad, tipo)) {
      throw new Error(`Capacidad no permitida para jaula de ${tipo}`);
    }
  }

  return await jaula.update(datos_actualizacion);
}

async function eliminar_jaula(jaula_id) {
  const jaula = await obtener_jaula_por_id(jaula_id);
  if (!validar_eliminacion_jaula(jaula_id)) {
    throw new Error('Esta jaula tiene conejos asignados. Por favor, reasigne o elimine los conejos antes de eliminar la jaula.');
  }

  return await jaula.destroy();
}

const jaula_servicio = {
  crear_jaula,
  obtener_jaulas,
  obtener_jaula_por_id,
  actualizar_jaula,
  validar_tipo_jaula,
  validar_capacidad_jaula,
  eliminar_jaula
};

module.exports = jaula_servicio;