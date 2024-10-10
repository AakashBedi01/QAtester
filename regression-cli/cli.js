#!/usr/bin/env node

import { getFlows } from './api.js';
import { runFlow } from './runner.js';
import { logPassed, logFailed, generateReport } from './report.js';

const retry = async (fn, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Retrying... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries reached');
};

// Wrap runFlow in retry logic
export const runFlowWithRetry = async (flow) => retry(() => runFlowInternal(flow));

// Internal flow runner
async function runFlowInternal(flow) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    for (const step of flow.steps) {
      console.log(`Executing step: ${step.action} on ${step.selector || step.value}`);

      switch (step.action) {
        case 'navigate':
          await page.goto(step.value, { timeout: 30000 });
          break;
        case 'click':
          await page.waitForSelector(step.selector, { timeout: 10000 });
          await page.click(step.selector);
          break;
        case 'type':
          await page.waitForSelector(step.selector, { timeout: 10000 });
          await page.type(step.selector, step.value);
          break;
        case 'hover':
          await page.hover(step.selector);
          break;
        case 'scroll':
          await page.evaluate((selector) => document.querySelector(selector).scrollIntoView(), step.selector);
          break;
        case 'assert':
          const text = await page.$eval(step.selector, el => el.innerText);
          if (text !== step.value) {
            throw new Error(`Assertion failed: Expected ${step.value} but found ${text}`);
          }
          break;
        default:
          console.error(`Unknown action: ${step.action}`);
      }
    }
    console.log(`Flow ${flow.name} executed successfully.`);
  } catch (error) {
    console.error(`Error running flow ${flow.name}:`, error);
    if (page && !page.isClosed()) {
      await page.screenshot({ path: `error_${flow.name}.png` });
      console.log(`Screenshot saved for flow: ${flow.name}`);
    } else {
      console.log('Unable to capture screenshot as the page is no longer active.');
    }
  } finally {
    await browser.close();
  }
}

// Main CLI logic
(async () => {
  const flows = await getFlows();
  if (flows.length === 0) {
    console.log('No flows found.');
    return;
  }

  for (const flow of flows) {
    console.log(`Running flow: ${flow.name}`);
    try {
      await runFlow(flow);
      logPassed(flow.name);
    } catch (error) {
      logFailed(flow.name, error.message);
    }
  }

  generateReport(); // Generate the test summary
})();
