// report.js
const fs = require('fs');

const report = {
  passed: [],
  failed: [],
  logPassed(testName) {
    this.passed.push(testName);
  },
  logFailed(testName, error) {
    this.failed.push({ testName, error });
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

    console.log("\nTest Summary:");
    console.log(`- Passed: ${summary.passed}`);
    console.log(`- Failed: ${summary.failed}`);

    // Optionally save report to a file
    fs.writeFileSync('test_report.json', JSON.stringify(summary, null, 2));
    console.log('Test report saved as test_report.json');
  },
};

module.exports = report;
