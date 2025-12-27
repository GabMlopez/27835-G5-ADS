const Jaula = require('../../modelos/modelo/jaula');
const { Op } = require('sequelize');

function validar_tipo_jaula(tipo) {
  return ['Reproduccion', 'Engorde'].includes(tipo);
}

function validar_capacidad_jaula(capacidad, tipo) {
  if (tipo === 'Reproduccion') {
    return capacidad === 1;
  }
  if (tipo === 'Engorde') {
    return capacidad >= 6 && capacidad <= 20; 
  }
  return false;
}

async function crear_jaula(datos) {
  if (!datos.jaula_tipo || !validar_tipo_jaula(datos.jaula_tipo)) {
    throw new Error('Tipo de jaula inválido. Debe ser "Reproduccion" o "Engorde"');
  }

  if (!datos.jaula_capacidad || !validar_capacidad_jaula(datos.jaula_capacidad, datos.jaula_tipo)) {
    throw new Error(`Capacidad inválida para jaula de tipo "${datos.jaula_tipo}"`);
  }

  const ultima_jaula = await Jaula.findOne({
    order: [['jaula_id', 'DESC']],
    where: { jaula_id: { [Op.like]: 'J%' } }
  });

  let numero_secuencial = 1;
  if (ultima_jaula) {
    numero_secuencial = parseInt(ultima_jaula.jaula_id.slice(1)) + 1;
  }

  if (numero_secuencial > 9999) {
    throw new Error('Se ha alcanzado el límite máximo de jaulas.');
  }

  datos.jaula_id = 'J' + String(numero_secuencial).padStart(4, '0');

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

  if (datos_actualizacion.jaula_capacidad) {
    const tipo = datos_actualizacion.jaula_tipo || jaula.jaula_tipo;
    if (!validar_capacidad_jaula(datos_actualizacion.jaula_capacidad, tipo)) {
      throw new Error(`Capacidad no permitida para jaula de ${tipo}`);
    }
  }

  return await jaula.update(datos_actualizacion);
}

const jaula_servicio = {
  crear_jaula,
  obtener_jaulas,
  obtener_jaula_por_id,
  actualizar_jaula,
  validar_tipo_jaula,
  validar_capacidad_jaula
};

module.exports = jaula_servicio;