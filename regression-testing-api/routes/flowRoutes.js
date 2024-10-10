import express from 'express';
import { createFlow, getFlows, runFlow } from '../controllers/flowController.js';

const router = express.Router();

router.post('/', createFlow);
router.get('/', getFlows);
router.post('/run-flow', runFlow);

export default router;
