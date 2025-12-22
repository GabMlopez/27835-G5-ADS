const { DataTypes } = require('sequelize');
const sequelize = require('../base_de_datos');
const conejo = sequelize.define('conejo',{
  conejo_id: {
    type: DataTypes.STRING(32),
    primaryKey: true,
    allowNull: false,
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
    type: DataTypes.NUMBER,
    allowNull: false,
    field: 'conejo_peso'
  },
  conejo_proposito: {
    type: DataTypes.STRING(16),
    allowNull: false,
    field: 'conejo_proposito'
  },
  conejo_fecha_nacimiento: {
    type: DataTypes.INTEGER,
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
    before_create: async (conejo) => {
        await validar_entrada();

        const raza = await Raza.findByPk(conejo.conejo_raza_id);
        if (!raza) {
                throw new Error('Raza no encontrada');
        }
        const raza_nombre = raza.raza_nombre.trim().split(/\s+/);
        const iniciales = raza_nombre.map(p => p.charAt(0).toUpperCase()).join('');
            
        const numero_conejo=await Conejo.count({
            where: {
                conejo_id: { [Op.like]: iniciales + '%' }
            }
        });

        const nuevo_id_num = numero_conejo + 1;
        if(nuevo_id_num > 9999){
            throw new Error('Se ha alcanzado el número máximo de conejos para esta raza.');
        }
        const id_conejo = String(nuevo_id_num).padStart(4, '0');

        conejo.conejo_id = iniciales + id_conejo;
        
    }
    },
    before_update: async (conejo) => {
        await validar_entrada();  
        if (conejo.changed('conejo_id')) {
            throw new Error('No se puede modificar el ID del conejo');
        }  
    }  
  });

conejo.prototype.validar_entrada = async function(entrada) {
    if(conejo.conejo_id == ''){
            throw new Error('El ID del conejo no puede estar vacío');
        }
        if(conejo.conejo_edad == ''){
            throw new Error('La edad del conejo no puede estar vacía');
        }
        if(conejo.conejo_peso == ''){
            throw new Error('El peso del conejo no puede estar vacío');
        }
        if(conejo.conejo_sexo == ''){
            throw new Error('El sexo del conejo no puede estar vacío');
        }
        if(conejo.conejo_proposito == ''){
            throw new Error('El propósito del conejo no puede estar vacío');
        }
        if(conejo.conejo_fecha_nacimiento == ''){
            throw new Error('La fecha de nacimiento del conejo no puede estar vacía');
        }

        if(conejo.jaula_id == ''){
            throw new Error('El ID de la jaula no puede estar vacío');
        }

        if(conejo.conejo_raza_id == ''){
            throw new Error('El ID de la raza del conejo no puede estar vacío');
        }

        if(conejo.conejo_estado == ''){
            throw new Error('El estado del conejo no puede estar vacío');
        }
        
        if(conejo.conejo_sexo != 'Macho' && conejo.conejo_sexo != 'Hembra'){
            throw new Error('El sexo del conejo debe ser Macho o Hembra');
        }

        if(conejo.conejo_edad < 0 && !Number.isInteger(conejo.conejo_edad)){
            throw new Error('La edad del conejo debe ser mayor o igual a 0');
        }

        if(conejo.conejo_peso <= 0){
            throw new Error('El peso del conejo debe ser mayor a 0');
        }

        if(conejo.conejo_peso >= 4.5){
            throw new Error('El peso del conejo no puede ser mayor a 4.5 kg');
        }

        if(conejo.conejo_proposito != 'Reproduccion' || conejo.conejo_proposito != 'Engorde' ){
            throw new Error('El propósito del conejo debe ser Reproducción o Engorde');
        }   

        if(conejo.conejo_estado != "Saludable" && conejo.conejo_estado != "Enfermo" && conejo.conejo_estado != "Muerto" && conejo.conejo_estado != "Preñada"){
            throw new Error('El estado del conejo debe ser Saludable, Enfermo, Muerto o Preñada');
        }

        if(conejo.conejo_sexo === "Macho" && conejo.conejo_estado === "Preñada"){
            throw new Error('Un conejo macho no puede estar en estado de Preñada');
        }
        return true;
}

module.exports = conejo;