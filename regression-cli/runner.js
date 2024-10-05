const flowService = require('../regression-testing-api/services/flowService');
const winston = require('winston');

// Set up a logging system
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'runner.log' })
  ]
});

// Reuse the flowService to run the flow
exports.runFlow = async (flow) => {
  try {
    // Pass the `startUrl` to the service when running the flow
    await flowService.runFlowSteps(flow);
    logger.info(`Flow ${flow.name} executed successfully.`);
  } catch (error) {
    logger.error(`Error running flow ${flow.name}:`, error.message);
  }
};
