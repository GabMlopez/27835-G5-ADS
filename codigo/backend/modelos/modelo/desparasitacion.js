const {DataTypes, Op} = require('sequelize');
const sequelize = require('../base_de_datos/sequelize');
const conejo = require('./conejo');

const desparasitacion = sequelize.define('desparasitacion', {
    desparasitacion_id: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        allowNull: true,
        unique: true,
    },
    desparasitacion_fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'desparasitacion_fecha'
    },
    desparasitacion_realizada: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'desparasitacion_realizada'
    },
    conejo_id: {
        type: DataTypes.STRING(32),
        allowNull: false,
        field: 'conejo_id'
    }
}, {
    tableName: 'desparasitacion',
    timestamps: false,
    hooks: {
        beforeCreate: async (instance) => {
            await instance.generarId();
            await instance.validar_entrada();

        },
        beforeUpdate: async (instance) => {
            await instance.validar_entrada();
            if (instance.changed('desparasitacion_id')) {
                throw new Error('No se puede modificar el ID de la desparasitacion');
            }
        }
    }
});

desparasitacion.prototype.generarId = async function() {
  const ultima_desparasitacion = await Desparasitacion.findOne({
    order: [['desparasitacion_id', 'DESC']],
    where: { desparasitacion_id: { [Op.like]: 'DES%' } }
  });

  let numero_secuencial = 1;
  if (ultima_desparasitacion) {
    numero_secuencial = parseInt(ultima_desparasitacion.desparasitacion_id.slice(3)) + 1;
  }

  if (numero_secuencial > 999999) {
    throw new Error('Se ha alcanzado el límite máximo de registros de desparasitación');
  }

  this.desparasitacion_id = 'DES' + String(numero_secuencial).padStart(6, '0');
}

desparasitacion.prototype.validar_entrada = async function() {
    if (!this.desparasitacion_id) {
        throw new Error('El ID de la desparasitacion es requerido');
    }
    if (!this.conejo_id) {
        throw new Error('El ID del conejo es requerido');
    }
    if (!this.desparasitacion_fecha) {
        throw new Error('La fecha es requerida');
    }
    if (this.desparasitacion_realizada === null || this.desparasitacion_realizada === undefined) {
        throw new Error('El campo desparasitacion_realizada es requerido');
    }
    const conejo_existente = await conejo.findByPk(this.conejo_id);
        if (!conejo_existente) {
            throw new Error('Conejo no encontrado');
        }
};

module.exports = desparasitacion;