const { DataTypes, Op } = require('sequelize');
const sequelize = require('../base_de_datos/sequelize');

const Jaula = sequelize.define('jaula', {
  jaula_id: {
    type: DataTypes.STRING(32),
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  jaula_tipo: {
    type: DataTypes.STRING(128),
    allowNull: false,
    field: 'jaula_tipo'
  },
  jaula_capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'jaula_capacidad'
  }
}, {
  tableName: 'jaula',
  timestamps: false,
  hooks: {
    beforeCreate: async (instance) => {

      const ultima_jaula = await Jaula.findOne({
        order: [['jaula_id', 'DESC']],
        where: { jaula_id: { [Op.like]: 'J%' } }
      });

      let nuevo_id_num = 1;
      if (ultima_jaula) {
        const ultima_id_num = parseInt(ultima_jaula.jaula_id.slice(1));
        nuevo_id_num = ultima_id_num + 1;
      }
      if (nuevo_id_num > 9999) {
        throw new Error('Se ha alcanzado el número máximo de jaulas permitidas.');
      }

      instance.jaula_id = 'J' + nuevo_id_num.toString().padStart(4, '0');

      await instance.validar_entrada();
    },
    beforeUpdate: async (instance) => {
      await instance.validar_entrada();
      if (instance.changed('jaula_id')) {
        throw new Error('No se puede modificar el ID de la jaula');
      }
    }
  }
});

Jaula.prototype.validar_entrada = async function() {
  if (!this.jaula_id) {
    throw new Error('El ID de la jaula no puede estar vacío');
  }
  if (!this.jaula_capacidad && this.jaula_capacidad !== 0) {
    throw new Error('La capacidad de la jaula no puede estar vacía');
  }
  if (!this.jaula_tipo) {
    throw new Error('El tipo de jaula no puede estar vacío');
  }

  if (this.jaula_capacidad <= 0) {
    throw new Error('La capacidad de la jaula debe ser un número positivo');
  }

  if (!isNaN(this.jaula_tipo)) {
    throw new Error('El tipo de jaula no puede ser un número');
  }

  if (!['Reproduccion', 'Engorde'].includes(this.jaula_tipo)) {
    throw new Error('El tipo de jaula debe ser "Reproduccion" o "Engorde"');
  }

  if (this.jaula_tipo === 'Reproduccion' && this.jaula_capacidad < 1) {
    throw new Error('La capacidad mínima para una jaula de reproducción es 1');
  }

  if (this.jaula_tipo === 'Engorde' && this.jaula_capacidad > 6) {
    throw new Error('La capacidad máxima para una jaula de engorde es 6');
  }
};

module.exports = Jaula;