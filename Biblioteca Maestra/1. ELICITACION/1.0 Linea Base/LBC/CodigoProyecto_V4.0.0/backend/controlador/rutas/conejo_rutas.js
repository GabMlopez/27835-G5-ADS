const express = require('express');
const router = express.Router();
const controller = require('../controller/conejo_contoller');
const {verificar_token} = require('../middleware/auth');

router.post('/new', verificar_token, controller.crear_conejo);
router.get('/', verificar_token, controller.obtener_conejos);
router.get('/:id', verificar_token, controller.obtener_conejo_por_id);
router.put('/update/:id', verificar_token, controller.actualizar_conejo);
router.delete('/delete/:id', verificar_token, controller.eliminar_conejo);

module.exports = router;