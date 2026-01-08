const Conejo = require('../../modelos/modelo/conejo');
const Raza = require('../models/raza'); 
const { Op } = require('sequelize');

async function crear_conejo(datos) {
  if (!datos.conejo_sexo) throw new Error('El sexo del conejo es requerido');
  if (!datos.conejo_edad && datos.conejo_edad !== 0) throw new Error('La edad del conejo es requerida');
  if (!datos.conejo_peso) throw new Error('El peso del conejo es requerido');
  if (!datos.conejo_proposito) throw new Error('El propósito del conejo es requerido');
  if (!datos.conejo_fecha_nacimiento) throw new Error('La fecha de nacimiento es requerida');
  if (!datos.jaula_id) throw new Error('El ID de la jaula es requerido');
  if (!datos.conejo_raza_id) throw new Error('El ID de la raza es requerido');
  if (!datos.conejo_estado) throw new Error('El estado del conejo es requerido');

  const raza = await Raza.findByPk(datos.conejo_raza_id);
  if (!raza) {
    throw new Error('Raza no encontrada');
  }

  const palabras = raza.conejo_raza_nombre.trim().split(/\s+/);
  const iniciales = palabras.map(p => p.charAt(0).toUpperCase()).join('');

  const count = await Conejo.count({
    where: {
      conejo_id: { [Op.like]: `${iniciales}%` }
    }
  });

  const nuevo_numero = count + 1;
  if (nuevo_numero > 9999) {
    throw new Error(`Se ha alcanzado el límite máximo de conejos para la raza ${raza.conejo_raza_nombre}`);
  }

  const id_numerico = String(nuevo_numero).padStart(4, '0');
  datos.conejo_id = iniciales + id_numerico;

  return await Conejo.create(datos);
}

async function obtener_conejos() {
  return await Conejo.findAll({
    include: [{ model: Raza, attributes: ['conejo_raza_nombre'] }],
    order: [['conejo_id', 'ASC']]
  });
}

async function obtener_conejo_por_id(conejo_id) {
  return await Conejo.findByPk(conejo_id, {
    include: [{ model: Raza, attributes: ['conejo_raza_nombre'] }]
  });
}

async function actualizar_conejo(conejo_id, datos_actualizacion) {
  const conejo = await obtener_conejo_por_id(conejo_id);
  if (!conejo) {
    throw new Error('Conejo no encontrado');
  }
  if (datos_actualizacion.conejo_id && datos_actualizacion.conejo_id !== conejo_id) {
    throw new Error('No se puede modificar el ID del conejo');
  }

  return await conejo.update(datos_actualizacion);
}

async function eliminar_conejo(conejo_id) {
  const conejo = await obtener_conejo_por_id(conejo_id);
  if (!conejo) {
    throw new Error('Conejo no encontrado');
  }
  await conejo.destroy();
  return { message: 'Conejo eliminado correctamente' };
}

const conejo_servicio= {
  crear_conejo,
  obtener_conejos,
  obtener_conejo_por_id,
  actualizar_conejo,
  eliminar_conejo
};

module.exports = conejo_servicio;