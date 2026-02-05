const express = require('express');
const router = express.Router();
const controller = require('../controller/vacunacion_controller');
const {verificar_token} = require('../middleware/auth');

router.post('/new/conejo',verificar_token,controller.crear_vacunacion_por_conejo);
router.post('/new/jaula',verificar_token,controller.crear_vacunacion_por_jaula);
router.put('/:id',verificar_token,controller.actualizar_vacunacion);
router.get('/conejo/:id',verificar_token,controller.obtener_vacunacion_por_conejo);
router.get('/:id',verificar_token,controller.obtener_vacunaciones_por_id);

module.exports = router;