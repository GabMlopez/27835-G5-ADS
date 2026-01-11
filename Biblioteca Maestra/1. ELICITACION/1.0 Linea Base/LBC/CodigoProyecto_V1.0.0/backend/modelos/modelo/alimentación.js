const { DataTypes, Op } = require('sequelize');
const sequelize = require('../base_de_datos/sequelize');
const conejo = require('./conejo');

const alimentacion = sequelize.define('alimentacion', {
  alimentacion_id: {
    type: DataTypes.STRING(32),
    primaryKey: true,
    allowNull: false,
  },
  alimentacion_fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'alimentacion_fecha'
  },
  alimentacion_justificacion: {
    type: DataTypes.STRING(128),
    allowNull: false,
    field: 'alimentacion_justificacion'
  },
  alimentacion_dieta: {
    type: DataTypes.STRING(128),
    allowNull: false,
    field: 'alimentacion_dieta'
  },
  conejo_id: {
    type: DataTypes.STRING(32),
    allowNull: false,
    field: 'conejo_id'
  }
}, {
  tableName: 'alimentacion',
  timestamps: false,
  hooks: {
    beforeCreate: async (instance) => {
      await instance.validar_entrada();
    },
    beforeUpdate: async (instance) => {
      await instance.validar_entrada();
      if (instance.changed('alimentacion_id')) {
        throw new Error('No se puede modificar el ID de la alimentación');
      }
    }
  }
});

alimentacion.prototype.validar_entrada = async function() {
  if (!this.alimentacion_id || !this.alimentacion_id.startsWith('ALM')) {
    throw new Error('El ID debe comenzar con "ALM" y tener formato válido');
  }
  if (!this.conejo_id) {
    throw new Error('El ID del conejo es requerido');
  }
  if (!this.alimentacion_fecha) {
    throw new Error('La fecha es requerida');
  }
  if (!this.alimentacion_justificacion) {
    throw new Error('La justificación es requerida');
  }
  if (!this.alimentacion_dieta) {
    throw new Error('La dieta es requerida');
  }

  const conejo_existente = await conejo.findByPk(this.conejo_id);
  if (!conejo_existente) {
    throw new Error('Conejo no encontrado');
  }

  return true;
};

module.exports = alimentacion;