require('dotenv').config();
const app = require('./main');

async function startServer() {
  const sequelize = require('./modelos/base_de_datos/sequelize');
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('Sistema conectado a PostgreSQL Database');
    } catch (error) {
      console.error('No fue posible hacer la conexión:', error);
    }
  })();
  
}

startServer();