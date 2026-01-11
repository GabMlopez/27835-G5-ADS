const { DataTypes, Op } = require('sequelize');
const sequelize = require('../base_de_datos/sequelize');
const conejo = require('./conejo');

const alimentacion = sequelize.define('alimentacion', {
  alimentacion_id: {
    type: DataTypes.STRING(32),
    primaryKey: true,
    allowNull: true,
    unique: true,
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
      await instance.generarId(instance);
      await instance.validar_entrada();
    },
    beforeUpdate: async (instance) => {
      await instance.validar_entrada();
      if (instance.changed('alimentacion_id')) {
        throw new Error('No se puede modificar el ID de la alimentación');
      }
      if (instance.changed('fecha_creacion')) {
        throw new Error('No se puede modificar la fecha de creación');
      }
    }
  }
});

alimentacion.prototype.generarId = async function() {
  const ultima_alimentacion = await alimentacion.findOne({
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
  
    this.alimentacion_id = 'ALM' + String(numero_secuencial).padStart(4, '0');
  }
  
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