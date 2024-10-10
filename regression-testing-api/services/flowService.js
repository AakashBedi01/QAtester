import puppeteer from 'puppeteer';
import winston from 'winston';

// Set up a logging system
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'flowService.log' })
  ]
});

// Function to perform different Puppeteer actions based on the step
const performAction = async (page, step) => {
  try {
    switch (step.action) {
      case 'click':
        await page.waitForSelector(step.selector, { timeout: 10000 });
        await page.click(step.selector);
        break;
      case 'navigate':
        await page.goto(step.value, { timeout: 30000 });
        break;
      case 'type':
        await page.waitForSelector(step.selector, { timeout: 10000 });
        await page.type(step.selector, step.value);
        break;
      case 'hover':
        await page.hover(step.selector);
        break;
      case 'scroll':
        await page.evaluate(selector => {
          document.querySelector(selector).scrollIntoView();
        }, step.selector);
        break;
      default:
        logger.warn(`Unknown action: ${step.action}`);
    }
  } catch (error) {
    logger.error(`Error performing action ${step.action}: ${error.message}`);
    throw error;
  }
};

// Function to run flow steps
export const runFlowSteps = async (flow) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    for (const step of flow.steps) {
      logger.info(`Executing step: ${step.action}`);
      await performAction(page, step);
    }
    logger.info(`Flow "${flow.name}" completed successfully.`);
  } catch (error) {
    logger.error(`Flow "${flow.name}" failed: ${error.message}`);
    throw error;
  } finally {
    await browser.close();
  }
};
