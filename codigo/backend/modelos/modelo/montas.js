const { DataTypes } = require('sequelize');
const sequelize = require('../base_de_datos');

const reproduccion = sequelize.define('reproduccion',{
  reproduccion_id: {
    type: DataTypes.STRING(32),
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  reproduccion_fecha: {
    type: DataTypes.INTEGER,
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
    before_create: async (reproduccion) => {
        await validar_entrada();
        
    },
    before_update: async (reproduccion) => {
        await validar_entrada();
        if (reproduccion.changed('reproduccion_id')) {
          throw new Error('No se puede modificar el ID de la reproducción');
        }
      }  
    }
});

reproduccion.prototype.validar_entrada = async function(entrada) {
    if(reproduccion.reproduccion_id == ''){ 
           throw new Error('El ID de la reproducción no puede estar vacío');
    }
    if(reproduccion.reproduccion_fecha == ''){
           throw new Error('La fecha de la reproducción no puede estar vacía');
    }

    if(reproduccion.conejo_id == ''){
           throw new Error('El ID del conejo no puede estar vacío');
    
    }
    
    if (reproduccion.reproduccion_fecha <= Date.now()) {
        throw new Error('La fecha de la reproducción debe ser una fecha futura');
    }

    return true;
    }
module.exports = reproduccion;