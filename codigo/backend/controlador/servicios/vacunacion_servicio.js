const Vacunacion = require('....//modelos/modelo/vacunacion');
const Conejo = require('../modelos/modelo/conejo');
const { Op } = require('sequelize');

async function generar_siguiente_id() {
  const ultima_vacunacion = await Vacunacion.findOne({
    order: [['vacunacion_id', 'DESC']],
    where: { vacunacion_id: { [Op.like]: 'V%' } }
  });

  let numero_secuencial = 1;
  if (ultima_vacunacion) {
    numero_secuencial = parseInt(ultima_vacunacion.vacunacion_id.slice(1)) + 1;
  }

  if (numero_secuencial > 999999) {
    throw new Error('Se ha alcanzado el límite máximo de registros de vacunación');
  }

  return 'V' + String(numero_secuencial).padStart(6, '0');
}

async function validar_vacunacion_anual(conejo_id, vacunacion_fecha, vacunacion_tipo) {
  const fecha = new Date(vacunacion_fecha);
  const un_anio_atras = new Date(fecha);
  un_anio_atras.setFullYear(un_anio_atras.getFullYear() - 1);

  const existente = await Vacunacion.findOne({
    where: {
      conejo_id,
      vacunacion_tipo,
      vacunacion_fecha: {
        [Op.between]: [un_anio_atras, fecha]
      }
    },
    order: [['vacunacion_fecha', 'DESC']]
  });

  if (existente) {
    throw new Error(`Este conejo ya fue vacunado contra "${vacunacion_tipo}" en el último año (última: ${existente.vacunacion_fecha.toLocaleDateString()}). Las vacunaciones deben ser anuales.`);
  }
}

async function crear_vacunacion_para_conejo(datos) {
  const { conejo_id, vacunacion_fecha, vacunacion_tipo } = datos;

  await validar_vacunacion_anual(conejo_id, vacunacion_fecha, vacunacion_tipo);

  const vacunacion_id = await generar_siguiente_id();

  const nueva_vacunacion = await Vacunacion.create({
    vacunacion_id,
    conejo_id,
    vacunacion_fecha,
    vacunacion_tipo
  });

  return nueva_vacunacion;
}

async function crear_vacunacion_para_jaula(jaula_id, vacunacion_fecha, vacunacion_tipo) {
  if (!jaula_id) {
    throw new Error('El ID de la jaula es requerido');
  }
  if (!vacunacion_fecha) {
    throw new Error('La fecha de vacunación es requerida');
  }
  if (!['Mixomatosis', 'VHD'].includes(vacunacion_tipo)) {
    throw new Error('Tipo de vacunación inválido');
  }

  const conejos = await Conejo.findAll({
    where: { jaula_id },
    attributes: ['conejo_id']
  });

  if (conejos.length === 0) {
    throw new Error('No hay conejos en esta jaula');
  }

  const vacunaciones_creadas = [];
  const errores = [];

  for (const conejo of conejos) {
    try {
      await validar_vacunacion_anual(conejo.conejo_id, vacunacion_fecha, vacunacion_tipo);

      const vacunacion_id = await generar_siguiente_id();
      const vacunacion = await Vacunacion.create({
        vacunacion_id,
        conejo_id: conejo.conejo_id,
        vacunacion_fecha,
        vacunacion_tipo
      });
      vacunaciones_creadas.push(vacunacion);
    } catch (error) {
      errores.push({
        conejo_id: conejo.conejo_id,
        error: error.message
      });
    }
  }

  return {
    mensaje: `Vacunación aplicada a ${vacunaciones_creadas.length} conejos`,
    exitosos: vacunaciones_creadas.length,
    fallidos: errores.length,
    detalles_fallidos: errores,
    vacunaciones: vacunaciones_creadas
  };
}

async function actualizar_vacunacion(vacunacion_id, datos_actualizacion) {
  const vacunacion = await Vacunacion.findByPk(vacunacion_id);
  if (!vacunacion) {
    throw new Error('Vacunación no encontrada');
  }

  if (datos_actualizacion.vacunacion_id) {
    throw new Error('No se puede modificar el ID de la vacunación');
  }
  if (datos_actualizacion.conejo_id) {
    throw new Error('No se puede cambiar el conejo asociado');
  }

  if (datos_actualizacion.vacunacion_fecha || datos_actualizacion.vacunacion_tipo) {
    const nueva_fecha = datos_actualizacion.vacunacion_fecha || vacunacion.vacunacion_fecha;
    const nuevo_tipo = datos_actualizacion.vacunacion_tipo || vacunacion.vacunacion_tipo;
    await validar_vacunacion_anual(vacunacion.conejo_id, nueva_fecha, nuevo_tipo);
  }

  return await vacunacion.update(datos_actualizacion);
}

async function obtener_vacunaciones_por_conejo(conejo_id) {
  return await Vacunacion.findAll({
    where: { conejo_id },
    order: [['vacunacion_fecha', 'DESC']]
  });
}

async function obtener_vacunacion_por_id(vacunacion_id) {
  return await Vacunacion.findByPk(vacunacion_id);
}

const vacunacion_servicio = {
  crear_vacunacion_para_conejo,
  crear_vacunacion_para_jaula,
  actualizar_vacunacion,
  obtener_vacunaciones_por_conejo,
  obtener_vacunacion_por_id
};

module.exports= vacunacion_servicio;