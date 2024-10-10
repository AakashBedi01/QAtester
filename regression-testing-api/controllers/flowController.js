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

// Utility to mask sensitive data in logs
const maskSensitiveData = (data) => {
  const maskedData = { ...data };
  if (maskedData.password) {
    maskedData.password = '*****';  // Example of masking
  }
  return maskedData;
};

// Create a new flow
export const createFlow = async (req, res) => {
  logger.info('Incoming flow data:', maskSensitiveData(req.body)); // Masked sensitive info

  try {
    const { name, description, steps } = req.body;
    if (!name || !steps) {
      return res.status(400).json({ error: 'Name and steps are required.' });
    }

    const newFlow = await Flow.create({ name, description, steps });
    logger.info(`Flow ${newFlow._id} created successfully`);

    return res.status(201).json(newFlow);
  } catch (error) {
    logger.error(`Error creating flow: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
