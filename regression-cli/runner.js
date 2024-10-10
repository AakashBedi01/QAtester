const { getLogger } = require('./utils');
const flowService = require('../regression-testing-api/services/flowService');

// Set up a logging system using the utility function
const logger = getLogger('runner.log');

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