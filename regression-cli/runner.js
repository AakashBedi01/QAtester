import { getLogger } from './utils.js';
import flowService from '../regression-testing-api/services/flowService.js';

// Set up a logging system using the utility function
const logger = getLogger('runner.log');

// Run flow with error handling and logging
export const runFlow = async (flow) => {
  try {
    // Pass the `startUrl` to the service when running the flow
    await flowService.runFlowSteps(flow);
    logger.info(`Flow "${flow.name}" executed successfully.`);
  } catch (error) {
    logger.error(`Error running flow "${flow.name}": ${error.message}`);
  }
};
