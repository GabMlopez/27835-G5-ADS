const pool = require('../../modelos/base_de_datos/db_pool');
function sanitize(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function actualizar_usuario(values) { 
    const query = 'UPDATE usuario SET usuario_contrasenia = $1 WHERE usuario_id = $2'
    ;
    return await pool.query(query, values)
}

async function obtener_usuario_por_username(username) {
  const query = `
    SELECT * FROM usuario WHERE usuario_usuario = $1
  `;
  const result = await pool.query(query, [sanitize(username)]);
  return result.rows[0] || null;
}

async function registrar_log(usuarioId, accion, detalles = null) {
  try {
    const query = `
      INSERT INTO log_acciones (usuario_id, accion, detalles, fecha_hora)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    `;
    await pool.query(query, [sanitize(usuarioId) || null, sanitize(accion), sanitize(detalles)]);
  } catch (error) {
    console.error('Error al registrar log:', error);
  }
}

async function incrementar_intentos_fallidos(usuarioId, intentosActuales) {
  const nuevosIntentos = intentosActuales + 1;
  let query, values;

  if (nuevosIntentos > 5) {
    const blockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    query = `
      UPDATE usuario
      SET failed_attempts = $1,
          last_failed_attempt = CURRENT_TIMESTAMP,
          is_blocked = TRUE,
          blocked_until = $2
      WHERE usuario_id = $3
    `;
    values = [nuevosIntentos, blockedUntil, sanitize(usuarioId)];
    await registrar_log(usuarioId, 'BLOQUEO_ACTIVADO', `Bloqueado por >5 intentos hasta ${blockedUntil}`);
  } else {
    query = `
      UPDATE usuario
      SET failed_attempts = $1,
          last_failed_attempt = CURRENT_TIMESTAMP
      WHERE usuario_id = $2
    `;
    values = [nuevosIntentos, sanitize(usuarioId)];
  }
  await pool.query(query, values);
  await registrar_log(usuarioId, 'LOGIN_FALLIDO', `Intento fallido #${nuevosIntentos}`);
}

async function resetear_intentos_fallidos(usuarioId) {
  const query = `
    UPDATE usuario
    SET failed_attempts = 0,
        last_failed_attempt = NULL,
        is_blocked = FALSE,
        blocked_until = NULL
    WHERE usuario_id = $1
  `;
  await pool.query(query, [sanitize(usuarioId)]);
  await registrar_log(usuarioId, 'LOGIN_EXITOSO');
}
const usuario_servicio = {
  sanitize,
  actualizar_usuario,
  obtener_usuario_por_username, 
  registrar_log, 
  incrementar_intentos_fallidos,
  resetear_intentos_fallidos
}
module.exports = { usuario_servicio};