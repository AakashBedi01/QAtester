const express = require('express');
const router = express.Router();
const flowController = require('../controllers/flowController');

router.post('/', flowController.createFlow);
router.get('/', flowController.getFlows);

module.exports = router;
