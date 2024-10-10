import React, { useState, useEffect } from 'react';
import { getFlows, runFlow } from '../api';

const Dashboard = () => {
  const [flows, setFlows] = useState([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const data = await getFlows();
        setFlows(data);
      } catch (error) {
        console.error('Error fetching flows:', error.message);
      }
    };

    fetchFlows();
  }, []);

  const handleRunFlow = async (flowName) => {
    try {
      setRunning(true);
      await runFlow(flowName);
      alert(`Flow "${flowName}" executed successfully!`);
    } catch (error) {
      console.error('Error running flow:', error.message);
    } finally {
      setRunning(false);
    }
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
