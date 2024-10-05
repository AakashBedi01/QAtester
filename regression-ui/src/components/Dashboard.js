// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { getFlows, runFlow } from '../api';

const Dashboard = () => {
  const [flows, setFlows] = useState([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    async function fetchFlows() {
      const data = await getFlows();
      setFlows(data);
    }

    fetchFlows();
  }, []);

  const handleRunFlow = async (flowName) => {
    setRunning(true);
    await runFlow(flowName);
    setRunning(false);
    alert(`Flow ${flowName} executed successfully!`);
  };

  return (
    <div>
      <h2>Available Flows</h2>
      <ul>
        {flows.map((flow) => (
          <li key={flow.name}>
            {flow.name}
            <button onClick={() => handleRunFlow(flow.name)} disabled={running}>
              {running ? 'Running...' : 'Run Flow'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
