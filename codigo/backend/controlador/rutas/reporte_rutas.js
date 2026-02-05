const express = require('express');
const router = express.Router();
const { verificar_token } = require('../auth');

const {
  totalConejos,
  conejosPorJaula,
  vacunacionesPorMes,
  totalUsuarios
} = require('../controller/reporte_controller');

router.get('/total-conejos', verificar_token, totalConejos);
router.get('/conejos-jaula', verificar_token, conejosPorJaula);
router.get('/vacunaciones-mes', verificar_token, vacunacionesPorMes);
router.get('/total-usuarios', verificar_token, totalUsuarios);

module.exports = router;
