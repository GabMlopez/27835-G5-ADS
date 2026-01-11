const express = require('express');
const router = express.Router();
const controller = require('../controller/jaula_controller');
const {verificar_token} = require('../middleware/auth');

router.post('/new', verificar_token, controller.createPen);
router.get('/', verificar_token, controller.getPens);
router.get("/:id", verificar_token,  controller.getPenById);
router.put("/update/:id", verificar_token, controller.updatePen);
router.delete("/delete/:id", verificar_token, controller.deletePen);
module.exports = router;