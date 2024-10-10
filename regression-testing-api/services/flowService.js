import puppeteer from 'puppeteer';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'flowService.log' })
  ]
});

// Retry mechanism for Puppeteer actions
const retryAction = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    logger.warn(`Retrying action due to: ${error.message}`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryAction(fn, retries - 1, delay * 2);  // Exponential backoff
  }
};

// Function to perform Puppeteer actions based on steps
const performAction = async (page, step) => {
  try {
    switch (step.action) {
      case 'click':
        await retryAction(() => page.waitForSelector(step.selector, { timeout: 5000 }));
        await page.click(step.selector);
        break;
      case 'type':
        await retryAction(() => page.waitForSelector(step.selector, { timeout: 5000 }));
        await page.type(step.selector, step.value);
        break;
      case 'navigate':
        await retryAction(() => page.goto(step.value, { waitUntil: 'networkidle0', timeout: 10000 }));
        break;
      default:
        throw new Error(`Unknown action: ${step.action}`);
    }
  } catch (error) {
    logger.error(`Error performing action "${step.action}": ${error.message}`);
    throw error;
  }
};

// Process the flow by executing each step
export const executeFlow = async (flow) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    for (const step of flow.steps) {
      logger.info(`Performing action: ${step.action} on ${step.selector || step.value}`);
      await performAction(page, step);
    }

    logger.info(`Flow ${flow.name} executed successfully.`);
  } catch (error) {
    logger.error(`Failed to execute flow ${flow.name}: ${error.message}`);
    throw error;
  } finally {
    if (browser) await browser.close();  // Ensure browser is closed
  }
};
