const controlador = require('../controller/raza_controller');
const express = require('express');
const router = express.Router();
const {verificar_token} = require('../middleware/auth');

router.post('/new', verificar_token, controlador.crearRaza);
router.get('/', verificar_token, controlador.obtenerRazas);
router.get('/:id', verificar_token, controlador.obtenerRazaPorId);

module.exports = router;