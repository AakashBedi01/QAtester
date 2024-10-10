#!/usr/bin/env node

import { getFlows } from './api.js';
import { runFlow } from './runner.js';
import { logPassed, logFailed, generateReport } from './report.js';
import puppeteer from 'puppeteer';

// Retry function with custom retries and delay
const retry = async (fn, retries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Retrying... (${attempt}/${retries})`);
      if (attempt === retries) {
        throw new Error('Max retries reached');
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
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
          await page.goto(step.value);
          break;
        case 'click':
          await page.click(step.selector);
          break;
        case 'type':
          await page.type(step.selector, step.value);
          break;
        // Add other actions here
        default:
          console.log(`Unknown action: ${step.action}`);
      }
    }
    await logPassed(flow);
  } catch (error) {
    console.error(`Flow execution failed: ${error.message}`);
    await logFailed(flow);
  } finally {
    await browser.close();
  }
}
