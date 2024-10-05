const puppeteer = require('puppeteer');
const winston = require('winston');

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
      await page.evaluate((selector) => {
        document.querySelector(selector).scrollIntoView();
      }, step.selector);
      break;
    case 'assert':
      const text = await page.$eval(step.selector, el => el.innerText);
      if (text !== step.value) {
        throw new Error(`Assertion failed: Expected ${step.value} but found ${text}`);
      }
      break;
    default:
      throw new Error(`Unknown action: ${step.action}`);
  }
};

// Function to run the steps of the flow
exports.runFlowSteps = async (flow) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

   // Navigate to the starting URL
   logger.info(`Navigating to ${flow.startUrl}`);
   await page.goto(flow.startUrl, { timeout: 30000 });

  try {
    for (const step of flow.steps) {
      logger.info(`Executing step: ${step.action} on ${step.selector || step.value}`);
      await performAction(page, step);
    }
  } catch (error) {
    logger.error('Error executing flow:', error.message);

    // Capture screenshot if an error occurs and the page is still active
    if (page && !page.isClosed()) {
      await page.screenshot({ path: `error_${flow.name}.png` });
      logger.info(`Screenshot saved for flow: ${flow.name}`);
    }
    throw error;
  } finally {
    await browser.close();
  }
};
