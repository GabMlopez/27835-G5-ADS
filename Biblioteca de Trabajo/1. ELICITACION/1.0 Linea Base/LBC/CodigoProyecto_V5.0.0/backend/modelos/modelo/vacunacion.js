const {DataTypes, Op} = require('sequelize');
const sequelize = require('../base_de_datos/sequelize');
const conejo = require('./conejo');

const Vacunacion = sequelize.define('vacunacion', {
    vacunacion_id: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        allowNull: true,
    },
    vacunacion_fecha: {
        type: DataTypes.DATE,
        allowNull: false,   
        field: 'vacunacion_fecha'
    },
    vacunacion_tipo: {
        type: DataTypes.STRING(16),
        allowNull: false,
        field: 'vacunacion_tipo'
    },
    conejo_id: {
        type: DataTypes.STRING(32),
        allowNull: false,
        field: 'conejo_id'
    }
}, {
    tableName: 'vacunacion',
    timestamps: false,
    hooks: {
        beforeCreate: async (instance) => {
            await instance.generar_siguiente_id();
            await instance.validar_entrada();
        },
        beforeUpdate: async (instance) => {
            await instance.validar_entrada();
            if (instance.changed('vacunacion_id')) {
                throw new Error('No se puede modificar el ID de la vacunación');
            }
        }
    }
});

Vacunacion.prototype.generar_siguiente_id = async function() {
  const ultima_vacunacion = await Vacunacion.findOne({
    order: [['vacunacion_id', 'DESC']],
    where: { vacunacion_id: { [Op.like]: 'V%' } }
  });

  let numero_secuencial = 1;
  if (ultima_vacunacion) {
    numero_secuencial = parseInt(ultima_vacunacion.vacunacion_id.slice(1)) + 1;
  }

  if (numero_secuencial > 999999) {
    throw new Error('Se ha alcanzado el límite máximo de registros de vacunación');
  }

  this.vacunacion_id = 'V' + String(numero_secuencial).padStart(6, '0');
}

Vacunacion.prototype.validar_entrada = async function() {
    if (!this.conejo_id) {
        throw new Error('El ID del conejo es requerido');
    }
    if (!this.vacunacion_fecha) {
        throw new Error('La fecha es requerida');
    }
    if (!this.vacunacion_tipo) {
        throw new Error('El tipo de vacunación es requerido');
    }

    const conejo_existente = await conejo.findByPk(this.conejo_id);
        if (!conejo_existente) {
            throw new Error('Conejo no encontrado');
        }

    if(['Mixomatosis', 'VHD'].indexOf(this.vacunacion_tipo) === -1) {
        throw new Error('Tipo de vacunación inválido. Debe ser  "Mixomatosis" o "VHD"');
    }
};

module.exports = Vacunacion;
