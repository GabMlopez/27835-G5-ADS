const express = require('express');
const router = express.Router();
const controller = require('../controller/desparacitacion_controller');
const {verificar_token} = require('../middleware/auth');

router.post('/new',verificar_token,controller.crear_desparasitacion);
router.post('/new_cage',verificar_token,controller.crear_desparasitacion_para_jaula);
router.put('/update/:id',verificar_token,controller.actualizar_desparasitacion);
router.get('/:id',verificar_token,controller.obtener_desparasitacion_por_id);
router.get('/conejo/:id',verificar_token,controller.obtener_desparasitaciones_por_conejo);

module.exports = router;