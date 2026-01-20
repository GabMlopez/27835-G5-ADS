const express = require('express');
const router = express.Router();
const controller = require('../controller/jaula_controller');
const {verificar_token} = require('../middleware/auth');

router.post('/new', verificar_token, controller.createPen);
module.exports = router;