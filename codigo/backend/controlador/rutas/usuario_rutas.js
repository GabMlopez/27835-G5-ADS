const express = require('express');
const router = express.Router();
const controller = require('../controller/usuario_controller');
const {verificar_token} = require('../middleware/auth');

router.post('/login', controller.login_user);
router.put('/update', verificar_token,controller.update_user)
module.exports = router;