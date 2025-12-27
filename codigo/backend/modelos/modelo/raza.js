const { DataTypes, Op } = require('sequelize');
const sequelize = require('../base_de_datos/sequelize');

const conejo_raza = sequelize.define('conejo_raza', {
  conejo_raza_id: {
    type: DataTypes.STRING(32),
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  conejo_raza_nombre: {
    type: DataTypes.STRING(64),
    allowNull: false,
    field: 'conejo_raza_nombre'
  },
  conejo_raza_descripcion: {
    type: DataTypes.STRING(512),
    allowNull: true,
    field: 'conejo_raza_descripcion'
  }
}, {
  tableName: 'conejo_raza',
  timestamps: false,
  hooks: {
    beforeCreate: async (instance) => {
      await instance.validar_entrada();

      const ultima_raza = await conejo_raza.findOne({
        order: [['conejo_raza_id', 'DESC']],
        where: { conejo_raza_id: { [Op.like]: 'CRZ%' } }
      });

      let nuevo_id_num = 1;
      if (ultima_raza) {
        const ultima_id_num = parseInt(ultima_raza.conejo_raza_id.slice(3));
        nuevo_id_num = ultima_id_num + 1;
      }
      if (nuevo_id_num > 99999) {
        throw new Error('Se ha alcanzado el número máximo de razas permitidas.');
      }

      instance.conejo_raza_id = 'CRZ' + nuevo_id_num.toString().padStart(5, '0');
    },
    beforeUpdate: async (instance) => {
      await instance.validar_entrada();
      if (instance.changed('conejo_raza_id')) {
        throw new Error('No se puede modificar el ID de la raza');
      }
    }
  }
});

conejo_raza.prototype.validar_entrada = async function() {
  if (!this.conejo_raza_id) {
    throw new Error('El ID de la raza no puede estar vacío');
  }
  if (!this.conejo_raza_nombre) {
    throw new Error('El nombre de la raza no puede estar vacío');
  }
  return true;
};

module.exports = conejo_raza;