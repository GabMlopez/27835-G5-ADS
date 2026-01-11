const { DataTypes, Op } = require('sequelize');
const sequelize = require('../base_de_datos/sequelize');

const reproduccion = sequelize.define('reproduccion', {
  reproduccion_id: {
    type: DataTypes.STRING(32),
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  reproduccion_fecha: {
    type: DataTypes.DATE,  
    allowNull: false,
    field: 'reproduccion_fecha'
  },
  conejo_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
    field: 'conejo_id'
  }
}, {
  tableName: 'reproduccion',
  timestamps: false,
  hooks: {
    beforeCreate: async (instance) => {
      await instance.validar_entrada();
    },
    beforeUpdate: async (instance) => {
      await instance.validar_entrada();
      if (instance.changed('reproduccion_id')) {
        throw new Error('No se puede modificar el ID de la reproducción');
      }
    }
  }
});

reproduccion.prototype.validar_entrada = async function() {
  if (!this.reproduccion_id) {
    throw new Error('El ID de la reproducción no puede estar vacío');
  }
  if (!this.reproduccion_fecha) {
    throw new Error('La fecha de la reproducción no puede estar vacía');
  }
  if (!this.conejo_id) {
    throw new Error('El ID del conejo no puede estar vacío');
  }

  if (new Date(this.reproduccion_fecha) <= new Date()) {
    throw new Error('La fecha de la reproducción debe ser una fecha futura');
  }

  return true;
};

module.exports = reproduccion;