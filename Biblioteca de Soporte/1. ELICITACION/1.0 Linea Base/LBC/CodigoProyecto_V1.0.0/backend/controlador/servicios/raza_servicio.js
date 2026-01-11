
const Raza = require('../../modelos/modelo/raza'); 
const { Op } = require('sequelize');
const sequelize = require('../../modelos/base_de_datos/sequelize');
function validar_nombre_raza(nombre) {
  if (!nombre || nombre.trim() === '') {
    throw new Error('El nombre de la raza es requerido');
  }

  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!regex.test(nombre.trim())) {
    throw new Error('El nombre de la raza solo puede contener letras y espacios');
  }

  return nombre.trim();
}

async function generar_siguiente_id() {
  const ultima_raza = await Raza.findOne({
    order: [['conejo_raza_id', 'DESC']],
    where: { conejo_raza_id: { [Op.like]: 'CRZ%' } }
  });
  let nuevo_id_num = 1;
  if (ultima_raza) {
    const ultima_id_num = parseInt(ultima_raza.conejo_raza_id.slice(3));
    nuevo_id_num = ultima_id_num + 1;
  }

  return 'CRZ' + String(nuevo_id_num).padStart(4, '0');
}

function validar_descripcion_raza(descripcion) {
  if (descripcion && descripcion.length > 512) {
    throw new Error('La descripción de la raza es demasiado larga. No puede exceder los 512 caracteres');
  }
  return descripcion ? descripcion.trim() : null;
}

async function crear_raza(datos) {
  const { conejo_raza_nombre, conejo_raza_descripcion } = datos;

  const nombre_normalizado = validar_nombre_raza(conejo_raza_nombre);

  const raza_existente = await Raza.findOne({
    where: sequelize.where(
      sequelize.fn('LOWER', sequelize.fn('TRIM', sequelize.col('conejo_raza_nombre'))),
      sequelize.fn('LOWER', nombre_normalizado)
    )
  });

  if (raza_existente) {
    throw new Error(`Ya existe una raza con el nombre "${nombre_normalizado}". Los nombres de raza deben ser únicos.`);
  }

  const descripcion_validada = validar_descripcion_raza(conejo_raza_descripcion);

  const conejo_raza_id = await generar_siguiente_id();

  return await Raza.create({
    conejo_raza_id,
    conejo_raza_nombre: nombre_normalizado,
    conejo_raza_descripcion: descripcion_validadagit
  });
}

async function actualizar_raza(conejo_raza_id, datos_actualizacion) {
  const raza = await obtener_raza_por_id(conejo_raza_id);

  if (datos_actualizacion.conejo_raza_id) {
    throw new Error('No se puede modificar el ID de la raza');
  }

  let nombre_a_verificar = raza.conejo_raza_nombre;

  if (datos_actualizacion.conejo_raza_nombre) {
    nombre_a_verificar = validar_nombre_raza(datos_actualizacion.conejo_raza_nombre);

    const duplicada = await Raza.findOne({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn('LOWER', sequelize.fn('TRIM', sequelize.col('conejo_raza_nombre'))),
            sequelize.fn('LOWER', nombre_a_verificar)
          ),
          { conejo_raza_id: { [Op.ne]: conejo_raza_id } }
        ]
      }
    });

    if (duplicada) {
      throw new Error(`Ya existe otra raza con el nombre "${nombre_a_verificar}". Los nombres deben ser únicos.`);
    }

    datos_actualizacion.conejo_raza_nombre = nombre_a_verificar;
  }

  if (datos_actualizacion.conejo_raza_descripcion) {
    datos_actualizacion.conejo_raza_descripcion = validar_descripcion_raza(
      datos_actualizacion.conejo_raza_descripcion
    );
  }

  return await raza.update(datos_actualizacion);
}

async function obtener_razas() {
  return await Raza.findAll({
    order: [['conejo_raza_nombre', 'ASC']]
  });
}

async function obtener_raza_por_id(conejo_raza_id) {
  const raza = await Raza.findByPk(conejo_raza_id);
  if (!raza) {
    throw new Error('Raza no encontrada');
  }
  return raza;
}

async function eliminar_raza(conejo_raza_id) {
    const raza = await obtener_raza_por_id(conejo_raza_id);

    const conejos_con_raza = await Conejo.count({ where: { conejo_raza_id } });
    
    if (conejos_con_raza > 0) {
        throw new Error('No se puede eliminar la raza porque hay conejos asociados');
    }

  await raza.destroy();
  return { mensaje: 'Raza eliminada correctamente' };
}

const raza_servicio = {
  crear_raza,
  obtener_razas,
  obtener_raza_por_id,
  actualizar_raza,
  eliminar_raza
};

module.exports = raza_servicio;