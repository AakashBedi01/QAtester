import React, { useState } from 'react';
import { runFlow } from '../api';

const FlowRun = ({ flowName }) => {
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);

  const handleRunFlow = async () => {
    try {
      setRunning(true);
      setStatus('Running...');
      await runFlow(flowName);
      setStatus(`Flow "${flowName}" completed successfully.`);
    } catch (error) {
      console.error('Error running flow:', error.message);
      setStatus(`Failed to run flow: ${error.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <h2>Run Flow: {flowName}</h2>
      <button onClick={handleRunFlow} disabled={running}>
        {running ? 'Running...' : 'Run Flow'}
      </button>
      <p>{status}</p>
    </div>
  );
};

export default FlowRun;
