const { DataTypes } = require('sequelize');
const sequelize = require('../base_de_datos');
const bcrypt = require('bcrypt');

const reproduccion = sequelize.define('reproduccion',{
  reproduccion_id: {
    type: DataTypes.STRING(32),
    primaryKey: true,
    allowNull: false,
  },
  reproduccion_fecha: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
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
    beforeCreate: async (reproduccion) => {
        //Servicio de conejos para comprobar sexo del conejo y proposito
        
    }
    }
});

Usuario.prototype.validarContrasenia = async function(contrasenia) {
  return await bcrypt.compare(contrasenia, this.usuario_contrasenia);
};

module.exports = Usuario;