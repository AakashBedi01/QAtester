#!/usr/bin/env node

const api = require('./api');
const runner = require('./runner');
const report = require('./report');

const retry = async (fn, retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        console.log(`Retrying... (${i + 1}/${retries})`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw new Error('Max retries reached');
  };
  
  // Wrap runFlow in retry logic
  exports.runFlow = async (flow) => {
    return retry(() => runFlowInternal(flow));
  };
  
  // Internal flow runner
  async function runFlowInternal(flow) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    try {
      for (const step of flow.steps) {
        console.log(`Executing step: ${step.action} on ${step.selector || step.value}`);
  
        if (step.action === 'navigate') {
          await page.goto(step.value, { timeout: 30000 });
        } else if (step.action === 'click') {
          await page.waitForSelector(step.selector, { timeout: 10000 });
          await page.click(step.selector);
        } else if (step.action === 'type') {
          await page.waitForSelector(step.selector, { timeout: 10000 });
          await page.type(step.selector, step.value);
        } else if (step.action === 'hover') {
          await page.hover(step.selector);
        } else if (step.action === 'scroll') {
          await page.evaluate((selector) => {
            document.querySelector(selector).scrollIntoView();
          }, step.selector);
        } else if (step.action === 'assert') {
          const text = await page.$eval(step.selector, el => el.innerText);
          if (text !== step.value) {
            throw new Error(`Assertion failed: Expected ${step.value} but found ${text}`);
          }
        }
      }
      console.log(`Flow ${flow.name} executed successfully.`);
    } catch (error) {
      console.error(`Error running flow ${flow.name}:`, error);
      if (page && page.isClosed() === false) {
        await page.screenshot({ path: `error_${flow.name}.png` });
        console.log(`Screenshot saved for flow: ${flow.name}`);
      } else {
        console.log('Unable to capture screenshot as the page is no longer active.');
      }
    } finally {
      await browser.close();
    }
  }
  

(async () => {
  const flows = await api.getFlows();
  if (flows.length === 0) {
    console.log('No flows found.');
    return;
  }

  for (const flow of flows) {
    console.log(`Running flow: ${flow.name}`);
    try {
      await runner.runFlow(flow);
      report.logPassed(flow.name);
    } catch (error) {
      report.logFailed(flow.name, error.message);
    }
  }

  report.generateReport(); // Generate the test summary
})();

// Main CLI logic
(async () => {
  const flows = await api.getFlows();
  if (flows.length === 0) {
    console.log('No flows found.');
    return;
  }

  for (const flow of flows) {
    console.log(`Running flow: ${flow.name}`);
    await runner.runFlow(flow);
  }
})();
