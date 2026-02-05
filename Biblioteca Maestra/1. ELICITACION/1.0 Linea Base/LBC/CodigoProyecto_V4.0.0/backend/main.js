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
const rutas_monta = require('./controlador/rutas/monta_rutas');
const rutas_raza = require('./controlador/rutas/raza_rutas');
const rutas_alimentacion = require('./controlador/rutas/alimentacion_rutas');
const rutas_conejo = require('./controlador/rutas/conejo_rutas');

app.use('/usuario', rutas_usuario);
app.use('/jaula', rutas_jaula);
app.use('/monta', rutas_monta);
app.use('/raza', rutas_raza);
app.use('/alimentacion', rutas_alimentacion);
app.use('/conejos', rutas_conejo);

module.exports = app;

if (require.main === module) {
  const port = 3001;
  app.listen(port, () => console.log("Sistema corriendo en --> " + port));
}