const Desparasitacion = require('../../modelos/modelo/desparasitacion');
const Conejo = require('../../modelos/modelo/conejo');
const { Op } = require('sequelize');


async function validar_desparasitacion_mensual(conejo_id, desparasitacion_fecha) {
  const fecha = new Date(desparasitacion_fecha);
  const un_mes_atras = new Date(fecha);
  un_mes_atras.setMonth(un_mes_atras.getMonth() - 1);

  const existente = await Desparasitacion.findOne({
    where: {
      conejo_id,
      desparasitacion_fecha: {
        [Op.between]: [un_mes_atras, fecha]
      }
    },
    order: [['desparasitacion_fecha', 'DESC']]
  });

  if (existente) {
    throw new Error(`Este conejo ya fue desparasitado en el último mes (última: ${existente.desparasitacion_fecha.toLocaleDateString()}). Las desparasitaciones deben ser mensuales.`);
  }
}

async function crear_desparasitacion(datos) {
  const { conejo_id, desparasitacion_fecha, desparasitacion_realizada } = datos;

  if (desparasitacion_realizada === null || desparasitacion_realizada === undefined) {
    throw new Error('El campo desparasitacion_realizada es requerido (true/false)');
  }

  await validar_desparasitacion_mensual(conejo_id, desparasitacion_fecha);

  const nueva_desparasitacion = await Desparasitacion.create({
    conejo_id,
    desparasitacion_fecha,
    desparasitacion_realizada
  });

  return nueva_desparasitacion;
}

async function crear_desparasitacion_para_jaula(jaula_id, desparasitacion_fecha, desparasitacion_realizada) {
  if (!jaula_id) {
    throw new Error('El ID de la jaula es requerido');
  }
  if (!desparasitacion_fecha) {
    throw new Error('La fecha de desparasitación es requerida');
  }
  if (desparasitacion_realizada === null || desparasitacion_realizada === undefined) {
    throw new Error('El campo desparasitacion_realizada es requerido (true/false)');
  }

  const conejos = await Conejo.findAll({
    where: { jaula_id },
    attributes: ['conejo_id']
  });

  if (conejos.length === 0) {
    throw new Error('No hay conejos en esta jaula');
  }

  const desparasitaciones_creadas = [];
  const errores = [];

  for (const conejo of conejos) {
    try {
      await validar_desparasitacion_mensual(conejo.conejo_id, desparasitacion_fecha);

      const desparasitacion_id = await generar_siguiente_id();
      const desparasitacion = await Desparasitacion.create({
        desparasitacion_id,
        conejo_id: conejo.conejo_id,
        desparasitacion_fecha,
        desparasitacion_realizada
      });
      desparasitaciones_creadas.push(desparasitacion);
    } catch (error) {
      errores.push({
        conejo_id: conejo.conejo_id,
        error: error.message
      });
    }
  }

  return {
    mensaje: `Desparasitación aplicada a ${desparasitaciones_creadas.length} conejos`,
    exitosos: desparasitaciones_creadas.length,
    fallidos: errores.length,
    detalles_fallidos: errores,
    desparasitaciones: desparasitaciones_creadas
  };
}

async function actualizar_desparasitacion(desparasitacion_id, datos_actualizacion) {
  const desparasitacion = await Desparasitacion.findByPk(desparasitacion_id);
  if (!desparasitacion) {
    throw new Error('Desparasitación no encontrada');
  }

  if (datos_actualizacion.desparasitacion_id) {
    throw new Error('No se puede modificar el ID de la desparasitación');
  }
  if (datos_actualizacion.conejo_id) {
    throw new Error('No se puede cambiar el conejo asociado');
  }

  if (datos_actualizacion.desparasitacion_fecha) {
    await validar_desparasitacion_mensual(desparasitacion.conejo_id, datos_actualizacion.desparasitacion_fecha);
  }

  return await desparasitacion.update(datos_actualizacion);
}

async function obtener_desparasitaciones_por_conejo(conejo_id) {
  return await Desparasitacion.findAll({
    where: { conejo_id },
    order: [['desparasitacion_fecha', 'DESC']]
  });
}

async function obtener_desparasitacion_por_id(desparasitacion_id) {
  return await Desparasitacion.findByPk(desparasitacion_id);
}

const desparasitacion_servicio= {
  crear_desparasitacion,
  crear_desparasitacion_para_jaula,
  actualizar_desparasitacion,
  obtener_desparasitaciones_por_conejo,
  obtener_desparasitacion_por_id
};

module.exports = desparasitacion_servicio;