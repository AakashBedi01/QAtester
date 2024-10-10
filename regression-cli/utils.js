const { generateAndSaveReport } = require('./utils');

export const getLogger = (logFileName) => {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: path.join('logs', logFileName) }),
        new winston.transports.Console(),
      ],
    });
  };

export const report = {
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
  
      // Use utility function to generate and save the report
      generateAndSaveReport(summary, 'test_report.json');
      logger.info('Test report generated and saved successfully.');
    },
  };
