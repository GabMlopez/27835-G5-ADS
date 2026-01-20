const { usuario_servicio } = require('../servicios/usuario_servicio');
const { generar_token } = require('../middleware/auth');
const bcrypt = require('bcrypt');


exports.login_user = async (req, res) => {
  const { username, password } = req.body;

  try {
    //Buscar usuario 
    const user = await usuario_servicio.obtener_usuario_por_username(username);

    if (!user) {
      await usuario_servicio.registrar_log("SiD0110110", 'LOGIN_FALLIDO', `Usuario no encontrado: ${username}`);
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    //Verificar si está bloqueado
    const now = new Date();
    if (user.is_blocked || (user.blocked_until && new Date(user.blocked_until) > now)) {
      await usuario_servicio.registrar_log(user.usuario_id, 'INTENTO_BLOQUEADO', `Bloqueado hasta ${user.blocked_until}`);
      return res.status(403).json({ 
        message: 'Cuenta bloqueada temporalmente. Intenta de nuevo en 30 minutos.' 
      });
    }

    // Validar contraseña
    const isValidPassword = await bcrypt.compare(password, user.usuario_contrasenia);
    if (!isValidPassword) {
      await usuario_servicio.incrementar_intentos_fallidos(user.usuario_id, user.failed_attempts || 0);
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Resetear contadores en exito
    await usuario_servicio.resetear_intentos_fallidos(user.usuario_id);

    // Generar token
    const payload = {
      id: user.usuario_id,
      usuario: user.usuario_usuario
    };
    const token = generar_token(payload);

    res.status(200).json({ token, user: payload });

  } catch (error) {
    console.error('Login error:', error);
    await usuario_servicio.registrar_log(null, 'ERROR_SERVIDOR', `Login error: ${error.message}`);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.update_user = async (req,res) => {
  const {id} = req.params;
  const {new_password} = req.body;
  if (!id || id === undefined || id === null || id === '') {
    return res.status(400).json({ error: 'ID de usuario no proporcionado' });
  }
  if (!new_password || new_password === undefined || new_password === null || new_password === '') {
    return res.status(400).json({ error: 'nueva contraseña no proporcionada' });
  }
  try {
    const saltRounds = 10; 
    const hashed_password = await bcrypt.hash(new_password, saltRounds);
    const values = [hashed_password,id];
    const result = await usuario_servicio.actualizar_usuario(values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
}