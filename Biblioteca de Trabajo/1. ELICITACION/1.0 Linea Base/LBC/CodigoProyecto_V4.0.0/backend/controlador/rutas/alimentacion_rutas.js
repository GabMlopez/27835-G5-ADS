const express = require('express');
const router = express.Router();
const controller = require('../controller/alimentacion_controller');
const {verificar_token} = require('../middleware/auth');

router.post('/new', verificar_token, controller.crear_alimentacion);
router.get('/list', verificar_token, controller.obtener_lista_alimentacion);
router.get('/conejo/:conejo_id', verificar_token, controller.obtener_alimentaciones_por_conejo);
router.get('/:id', verificar_token, controller.obtener_alimentacion_por_id);
router.put('/:id', verificar_token, controller.actualizar_alimentacion);
module.exports = router;