const Alimentacion = require('../../modelos/modelo/alimentacion');
const { Op } = require('sequelize');

async function crear_alimentacion(datos) {
  if (!datos.conejo_id) {
    throw new Error('El ID del conejo es requerido');
  }
  if (!datos.alimentacion_fecha) {
    throw new Error('La fecha de alimentación es requerida');
  }
  if (!datos.alimentacion_justificacion) {
    throw new Error('La justificación es requerida');
  }
  if (!datos.alimentacion_dieta) {
    throw new Error('La dieta es requerida');
  }

  const fecha = new Date(datos.alimentacion_fecha);
  const inicio_dia = new Date(fecha);
  inicio_dia.setHours(0, 0, 0, 0);
  const fin_dia = new Date(fecha);
  fin_dia.setHours(23, 59, 59, 999);

  const conteo_existente = await Alimentacion.count({
    where: {
      conejo_id: datos.conejo_id,
      alimentacion_fecha: {
        [Op.between]: [inicio_dia, fin_dia]
      }
    }
  });

  if (conteo_existente >= 2) {
    throw new Error('Este conejo ya tiene 2 registros de alimentación hoy. No se pueden agregar más.');
  }

  const ultima_alimentacion = await Alimentacion.findOne({
    order: [['alimentacion_id', 'DESC']],
    where: { alimentacion_id: { [Op.like]: 'ALM%' } }
  });

  let numero_secuencial = 1;
  if (ultima_alimentacion) {
    numero_secuencial = parseInt(ultima_alimentacion.alimentacion_id.slice(3)) + 1;
  }

  if (numero_secuencial > 9999) {
    throw new Error('Se ha alcanzado el límite máximo de registros de alimentación (9999).');
  }

  datos.alimentacion_id = 'ALM' + String(numero_secuencial).padStart(4, '0');

  return await Alimentacion.create(datos);
}

async function obtener_alimentaciones_por_conejo(conejo_id) {
  return await Alimentacion.findAll({
    where: { conejo_id },
    order: [['alimentacion_fecha', 'DESC']]
  });
}

async function obtener_alimentacion_por_id(alimentacion_id) {
  return await Alimentacion.findByPk(alimentacion_id);
}

const alimentacion_servicio = {
  crear_alimentacion,
  obtener_alimentaciones_por_conejo,
  obtener_alimentacion_por_id
};

module.exports = alimentacion_servicio;