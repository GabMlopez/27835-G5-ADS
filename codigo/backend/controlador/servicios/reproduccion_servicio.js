const Reproduccion = require('../../modelos/modelo/reproduccion');
const Conejo = require('../../modelos/modelo/conejo');
const { Op } = require('sequelize');

async function crear_reproduccion(datos) {
  if (!datos.conejo_id) {
    throw new Error('El ID del conejo es requerido');
  }
  if (!datos.reproduccion_fecha) {
    throw new Error('La fecha de reproducción es requerida');
  }

  const fecha_reproduccion = new Date(datos.reproduccion_fecha);
  if (fecha_reproduccion <= new Date()) {
    throw new Error('La fecha de reproducción debe ser futura');
  }

  const conejo = await Conejo.findByPk(datos.conejo_id);
  if (!conejo) {
    throw new Error('Conejo no encontrado');
  }

  if (conejo.conejo_sexo !== 'Hembra') {
    throw new Error('Solo conejos hembra pueden tener registros de reproducción');
  }

  if (conejo.conejo_estado !== 'Saludable' && conejo.conejo_estado !== 'Preñada') {
    throw new Error('El conejo debe estar Saludable o Preñada para registrar una monta');
  }

  const ultima_reproduccion = await Reproduccion.findOne({
    order: [['reproduccion_id', 'DESC']],
    where: { reproduccion_id: { [Op.like]: 'REP%' } }
  });

  let numero_secuencial = 1;
  if (ultima_reproduccion) {
    numero_secuencial = parseInt(ultima_reproduccion.reproduccion_id.slice(3)) + 1;
  }

  if (numero_secuencial > 9999) {
    throw new Error('Se ha alcanzado el límite máximo de registros de reproducción');
  }

  datos.reproduccion_id = 'REP' + String(numero_secuencial).padStart(4, '0');

  return await Reproduccion.create(datos);
}

async function obtener_reproducciones() {
  return await Reproduccion.findAll({
    include: [{ model: Conejo, attributes: ['conejo_id', 'conejo_sexo'] }],
    order: [['reproduccion_fecha', 'DESC']]
  });
}

async function obtener_reproducciones_por_conejo(conejo_id) {
  return await Reproduccion.findAll({
    where: { conejo_id },
    order: [['reproduccion_fecha', 'DESC']]
  });
}

async function obtener_reproduccion_por_id(reproduccion_id) {
  return await Reproduccion.findByPk(reproduccion_id, {
    include: [{ model: Conejo }]
  });
}

async function listar_reproducciones() {
  return await Reproduccion.findAll({
    include: [{ model: Conejo, attributes: ['conejo_id', 'conejo_sexo'] }],
    order: [['reproduccion_fecha', 'DESC']]
  });
}

const reproduccion_servicio = {
  crear_reproduccion,
  obtener_reproducciones,
  obtener_reproducciones_por_conejo,
  obtener_reproduccion_por_id,
  listar_reproducciones
};

module.exports = reproduccion_servicio;