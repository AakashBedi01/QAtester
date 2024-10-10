import Flow from '../models/Flow.js';
import flowService from '../services/flowService.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'flowController.log' })
  ]
});

// Create a new flow
export const createFlow = async (req, res) => {
  logger.info('Incoming flow data:', req.body); // Log incoming request body

  try {
    const { name, description, steps, startUrl } = req.body;
    logger.info('Parsed data:', { name, description, steps, startUrl }); // Log parsed data

    const newFlow = new Flow({ name, description, steps, startUrl });
    await newFlow.save();
    
    res.status(201).json(newFlow);
  } catch (error) {
    logger.error('Error saving flow:', error.message);
    res.status(500).json({ error: 'Error creating flow', details: error.message });
  }
};

// Fetch all flows
export const getFlows = async (req, res) => {
  try {
    const flows = await Flow.find({});
    res.json(flows);
  } catch (error) {
    logger.error('Error fetching flows:', error.message);
    res.status(500).json({ error: 'Error fetching flows', details: error.message });
  }
};
