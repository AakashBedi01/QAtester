const { generateAndSaveReport, getLogger } = require('./utils');

// Set up a logging system using the utility function
const logger = getLogger('report.log');

const report = {
  passed: [],
  failed: [],
  logPassed(testName) {
    this.passed.push(testName);
    logger.info(`Test passed: ${testName}`);
  },
  logFailed(testName, error) {
    this.failed.push({ testName, error });
    logger.error(`Test failed: ${testName}, Error: ${error.message}`);
  },
  generateReport() {
    const summary = {
      passed: this.passed.length,
      failed: this.failed.length,
      details: {
        passedTests: this.passed,
        failedTests: this.failed,
      },
    };

    // Use utility function to generate and save report
    generateAndSaveReport(summary, 'test_report.json');
    logger.info('Test report generated and saved successfully.');
  },
};

module.exports = report;