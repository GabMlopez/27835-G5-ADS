const express = require('express');
const router = express.Router();
const controller = require('../controller/monta_controller');
const {verificar_token} = require('../middleware/auth');

router.post('/create', verificar_token, controller.create_reproduccion);
router.get('/all', verificar_token, controller.get_reproducciones);
router.get('/find/:conejo_id', verificar_token, controller.get_reproducciones_por_conejo);

module.exports = router;