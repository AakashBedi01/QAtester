const express = require('express');
const router = express.Router();
const flowController = require('../controllers/flowController');

router.post('/', flowController.createFlow);
router.get('/', flowController.getFlows);
router.post('/run-flow', flowController.runFlow);

module.exports = router;
