const {DataTypes, Op} = require('sequelize');
const sequelize = require('../base_de_datos/sequelize');
const conejo = require('./conejo');

const vacunacion = sequelize.define('vacunacion', {
    vacunacion_id: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        allowNull: false,
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
vacunacion.prototype.validar_entrada = async function() {
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

module.exports = vacunacion;
