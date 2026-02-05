const { DataTypes } = require('sequelize');
const sequelize = require('../base_de_datos/sequelize');
const bcrypt = require('bcrypt');

const usuario = sequelize.define('usuario', { 
  usuario_id: {
    type: DataTypes.STRING(32),
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  usuario_usuario: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true,
    field: 'usuario_usuario'
  },
  usuario_contrasenia: {
    type: DataTypes.STRING(64),
    allowNull: false,
    field: 'usuario_contrasenia'
  }
}, {
  tableName: 'usuario',
  timestamps: false,
  hooks: {
    beforeCreate: async (instance) => {
      if (!instance.usuario_id) {
        throw new Error('El ID del usuario no puede estar vacío');
      }
      if (!instance.usuario_usuario) {
        throw new Error('El nombre de usuario no puede estar vacío');
      }
      if (!instance.usuario_contrasenia) {
        throw new Error('La contraseña no puede estar vacía');
      }

      const saltRounds = 10;
      instance.usuario_contrasenia = await bcrypt.hash(instance.usuario_contrasenia, saltRounds);
    },
    beforeUpdate: async (instance) => {
      if (instance.changed('usuario_contrasenia')) {
        const saltRounds = 10;
        instance.usuario_contrasenia = await bcrypt.hash(instance.usuario_contrasenia, saltRounds);
      }
    }
  }
});

usuario.prototype.validarContrasenia = async function(contrasenia) {
  return await bcrypt.compare(contrasenia, this.usuario_contrasenia);
};

module.exports = usuario;