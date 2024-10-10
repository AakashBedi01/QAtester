import React, { useEffect, useState } from 'react';
import { getTestReport } from '../api';

const TestReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getTestReport();
        setReport(data);
      } catch (error) {
        console.error('Error fetching test report:', error.message);
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <div>Loading report...</div>;
  if (error) return <div>{error}</div>;

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
            {test.screenshot && (
              <a href={`/screenshots/${test.screenshot}`} target="_blank" rel="noopener noreferrer">
                View Screenshot
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestReport;
