// src/components/TestReport.js
import React, { useEffect, useState } from 'react';
import { getTestReport } from '../api';

const TestReport = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      const data = await getTestReport();
      setReport(data);
    }

    fetchReport();
  }, []);

  if (!report) {
    return <div>Loading report...</div>;
  }

  return (
    <div>
      <h2>Test Report</h2>
      <p>Passed: {report.passed}</p>
      <p>Failed: {report.failed}</p>
      <h3>Failed Tests</h3>
      <ul>
        {report.details.failedTests.map((test, index) => (
          <li key={index}>
            {test.testName} - {test.error}
            {test.screenshot && <a href={`/screenshots/${test.screenshot}`} target="_blank">View Screenshot</a>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestReport;
