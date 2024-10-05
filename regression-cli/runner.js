// runner.js
const puppeteer = require('puppeteer');

// Execute the flow using Puppeteer
exports.runFlow = async (flow) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    try {
      for (const step of flow.steps) {
        console.log(`Executing step: ${step.action} on ${step.selector || step.value}`);
  
        if (step.action === 'navigate') {
          await page.goto(step.value, { timeout: 30000 }); // 30s timeout for navigation
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
  
      // Only capture screenshot if the page is still active
      if (page && !page.isClosed()) {
        await page.screenshot({ path: `error_${flow.name}.png` });
        console.log(`Screenshot saved for flow: ${flow.name}`);
      } else {
        console.log('Unable to capture screenshot as the page is no longer active.');
      }
    } finally {
      await browser.close();
    }
  };
  
  
  
  
