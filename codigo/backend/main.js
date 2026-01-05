const express = require("express");
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

const rutas_usuario = require('./controlador/rutas/usuario_rutas');
const rutas_jaula = require('./controlador/rutas/jaula_rutas');
const rutas_raza = require('./controlador/rutas/raza_rutas');

app.use('/usuario', rutas_usuario);
app.use('/jaula', rutas_jaula);
app.use('/raza', rutas_raza);

module.exports = app;

if (require.main === module) {
  const port = 3001;
  app.listen(port, () => console.log("Sistema corriendo en --> " + port));
}