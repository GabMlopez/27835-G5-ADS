const { DataTypes, Op } = require('sequelize');
const sequelize = require('../base_de_datos/sequelize');
const Raza = require('./raza');

const conejo = sequelize.define('conejo',{
  conejo_id: {
    type: DataTypes.STRING(32),
    primaryKey: true,
    allowNull: true,
    unique: true,
  },
  conejo_sexo: {
    type: DataTypes.STRING(16),
    allowNull: false,
    field: 'conejo_sexo' 
  },
  conejo_edad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'conejo_edad'
  },
  conejo_peso: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: false,
    field: 'conejo_peso'
  },
  conejo_proposito: {
    type: DataTypes.STRING(16),
    allowNull: false,
    field: 'conejo_proposito'
  },
  conejo_fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'conejo_fecha_nacimiento'
  },
  jaula_id: {
    type: DataTypes.STRING(32),
    allowNull: false,
    field: 'jaula_id'
  },
  conejo_raza_id: {
    type: DataTypes.STRING(32),
    allowNull: false,
    field: 'conejo_raza_id'
  },
  conejo_estado: {
    type: DataTypes.STRING(16),
    allowNull: false,
    field: 'conejo_estado'
  }
}, {
  tableName: 'conejo',     
  timestamps: false,       
  hooks: {
    beforeCreate: async (instance) => {  
      
      await instance.generarId();
      await instance.validar_entrada();  
    },

    beforeUpdate: async (instance) => {
      await instance.validar_entrada();

      if (instance.changed('conejo_id')) {
        throw new Error('No se puede modificar el ID del conejo');
      }
    }
  }
});

conejo.prototype.generarId = async function() {
  const raza = await Raza.findByPk(this.conejo_raza_id);

      if (!raza) {
        throw new Error('Raza no encontrada');
      }

      const palabras = raza.conejo_raza_nombre.trim().split(/\s+/);
      const iniciales = palabras.map(p => p.charAt(0).toUpperCase()).join('');

      const count = await conejo.count({
        where: {
          conejo_id: { [Op.like]: iniciales + '%' }
        }
      });

      const nuevoNumero = count + 1;
      if (nuevoNumero > 9999) {
        throw new Error('Se ha alcanzado el número máximo de conejos para esta raza.');
      }

      const idNumerico = String(nuevoNumero).padStart(4, '0');

      this.conejo_id = iniciales + idNumerico;
};

conejo.prototype.validar_entrada = async function() {
  if (this.conejo_edad === null || this.conejo_edad === undefined || this.conejo_edad === '') {
    throw new Error('La edad del conejo no puede estar vacía');
  }
  if (this.conejo_peso === null || this.conejo_peso === undefined || this.conejo_peso === '') {
    throw new Error('El peso del conejo no puede estar vacío');
  }
  if (!this.conejo_sexo) {
    throw new Error('El sexo del conejo no puede estar vacío');
  }
  if (!this.conejo_proposito) {
    throw new Error('El propósito del conejo no puede estar vacío');
  }
  if (!this.conejo_fecha_nacimiento) {
    throw new Error('La fecha de nacimiento del conejo no puede estar vacía');
  }
  if (!this.jaula_id) {
    throw new Error('El ID de la jaula no puede estar vacío');
  }
  if (!this.conejo_raza_id) {
    throw new Error('El ID de la raza del conejo no puede estar vacío');
  }
  if (!this.conejo_estado) {
    throw new Error('El estado del conejo no puede estar vacío');
  }

  if (!['Macho', 'Hembra'].includes(this.conejo_sexo)) {
    throw new Error('El sexo del conejo debe ser Macho o Hembra');
  }

  if (!Number.isInteger(this.conejo_edad) || this.conejo_edad < 0) {
    throw new Error('La edad del conejo debe ser un número entero mayor o igual a 0');
  }

  if (this.conejo_peso <= 0) {
    throw new Error('El peso del conejo debe ser mayor a 0');
  }

  if (this.conejo_peso >= 4.5) {
    throw new Error('El peso del conejo no puede ser mayor a 4.5 kg');
  }

  if (!['Reproduccion', 'Engorde'].includes(this.conejo_proposito)) {
    throw new Error('El propósito del conejo debe ser Reproduccion o Engorde');
  }

  if (!['Saludable', 'Enfermo', 'Muerto', 'Preñada'].includes(this.conejo_estado)) {
    throw new Error('El estado del conejo debe ser Saludable, Enfermo, Muerto o Preñada');
  }

  if (this.conejo_sexo === 'Macho' && this.conejo_estado === 'Preñada') {
    throw new Error('Un conejo macho no puede estar en estado de Preñada');
  }

  return true;
};

conejo.belongsTo(Raza, {
  foreignKey: 'conejo_raza_id',
  as: 'raza'
});

module.exports = conejo;