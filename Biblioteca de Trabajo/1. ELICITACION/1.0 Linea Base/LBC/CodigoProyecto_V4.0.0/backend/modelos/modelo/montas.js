const { DataTypes, Op } = require('sequelize');
const sequelize = require('../base_de_datos/sequelize');
const conejo = require('./conejo');

const reproduccion = sequelize.define('reproduccion', {
  reproduccion_id: {
    type: DataTypes.STRING(32),
    primaryKey: true,
    unique: true,
    allowNull: true,
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
  },reproduccion_estado: {
    type: DataTypes.STRING(32),
    allowNull: true,
    field: 'reproduccion_estado'
  }
}, {
  tableName: 'reproduccion',
  timestamps: false,
  hooks: {
    beforeCreate: async (instance) => {
      await instance.generarId();
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

reproduccion.prototype.generarId = async function() {
  const ultima_reproduccion = await reproduccion.findOne({
    order: [['reproduccion_id', 'DESC']],
    where: { reproduccion_id: { [Op.like]: 'REP%' } }
  });

  let numero_secuencial = 1;
  if (ultima_reproduccion) {
    numero_secuencial = parseInt(ultima_reproduccion.reproduccion_id.slice(3)) + 1;
  }

  if (numero_secuencial > 9999) {
    throw new Error('Se ha alcanzado el límite máximo de registros de la monta');
  }

  this.reproduccion_id = 'REP' + String(numero_secuencial).padStart(4, '0');
};
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

  if (!this.reproduccion_estado){
    throw new Error('El estado de la reproducción no puede estar vacío');
  }
  if (new Date(this.reproduccion_fecha) <= new Date()) {
    throw new Error('La fecha de la reproducción debe ser una fecha futura');
  }

  return true;
};

reproduccion.belongsTo(conejo, {
  foreignKey: 'conejo_id',
  as: 'conejo'
});
module.exports = reproduccion;