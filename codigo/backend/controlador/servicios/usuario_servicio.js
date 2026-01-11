const Usuario = require('../../modelos/modelo/usuario');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

async function obtener_usuario_por_username(username) {
  if (!username) throw new Error('Nombre de usuario requerido');
  return await Usuario.findOne({
    where: { usuario_usuario: username }
  });
}

function esta_bloqueado(usuario) {
  if (!usuario) return false;
  if (!usuario.is_blocked) return false;
  if (usuario.blocked_until && new Date() > new Date(usuario.blocked_until)) {
    return false; 
  }
  return true;
}

async function incrementar_intentos_fallidos(usuario_id, intentos_actuales = 0) {
  const nuevos_intentos = intentos_actuales + 1;
  const updates = {
    failed_attempts: nuevos_intentos,
    last_failed_attempt: new Date()
  };

  if (nuevos_intentos > 5) {
    updates.is_blocked = true;
    updates.blocked_until = new Date(Date.now() + 30 * 60 * 1000); 
  }

  await Usuario.update(updates, {
    where: { usuario_id }
  });

}

async function resetear_intentos_fallidos(usuario_id) {
  await Usuario.update({
    failed_attempts: 0,
    last_failed_attempt: null,
    is_blocked: false,
    blocked_until: null
  }, {
    where: { usuario_id }
  });
}

async function actualizar_contrasenia(usuario_id, contrasenia_plana) {
  if (!contrasenia_plana) throw new Error('Contraseña requerida');

  const hash = await bcrypt.hash(contrasenia_plana, 10);

  const [updated] = await Usuario.update(
    { usuario_contrasenia: hash },
    { where: { usuario_id } }
  );

  if (updated === 0) throw new Error('Usuario no encontrado');
}

async function validar_contrasenia(contrasenia_plana, hash_almacenado) {
  return await bcrypt.compare(contrasenia_plana, hash_almacenado);
}

async function crear_usuario(datos) {
  const hash = await bcrypt.hash(datos.usuario_contrasenia, 10);
  datos.usuario_contrasenia = hash;
  return await Usuario.create(datos);
}

async function registrar_log(usuario_id, accion, descripcion) {
  
}

const usuario_servicio = {
  obtener_usuario_por_username,
  esta_bloqueado,
  incrementar_intentos_fallidos,
  resetear_intentos_fallidos,
  actualizar_contrasenia,
  validar_contrasenia,
  crear_usuario,
  registrar_log
};

module.exports = { usuario_servicio };