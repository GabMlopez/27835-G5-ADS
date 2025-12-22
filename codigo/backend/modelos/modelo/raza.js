const {DataTypes, Model, where} = require('sequelize');
const sequelize = require('../base_de_datos');

const conejo_raza = sequelize.define('conejo_raza',{
  conejo_raza_id: {
    type: DataTypes.STRING(32), 
    primaryKey: true,
    allowNull: false,
    unique: true,
  },    
    conejo_raza_nombre: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: false,
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
    before_create: async (conejo_raza) => {
        await validar_entrada();
        const ultima_raza = await conejo_raza.findOne({
            order: [['conejo_raza_id', 'DESC']],
            where: {[Op.like]: 'CRZ%' }
        });
        let nuevo_id_num = 1;
        if (ultima_raza) {
            const ultima_id_num = parseInt(ultima_raza.conejo_raza_id.slice(3));
            nuevo_id_num = ultima_id_num + 1;
        }
        if (nuevo_id_num > 99999) {
            throw new Error('Se ha alcanzado el número máximo de razas permitidas.');
        }
        conejo_raza.conejo_raza_id = 'CRZ' + nuevo_id_num.toString().padStart(5, '0');
    },
    before_update: async (conejo_raza) => {
        await validar_entrada();
        if (conejo_raza.changed('conejo_raza_id')) {
            throw new Error('No se puede modificar el ID de la conejo_raza');
        } 
    }
    }
});

conejo_raza.prototype.validar_entrada = async function(entrada) {
    if(conejo_raza.conejo_raza_id == ''){ 
        throw new Error('El ID de la raza no puede estar vacío');
       }
    if(conejo_raza.conejo_raza_nombre == ''){
        throw new Error('El nombre de la raza no puede estar vacío');
    }
    
    if(conejo_raza.conejo_raza_descripcion == ''){
        throw new Error('La descripción de la raza no puede estar vacía');
    } 
    return true;
    }

module.exports = conejo_raza;