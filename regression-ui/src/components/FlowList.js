import React from 'react';

const FlowList = ({ flows, onRunFlow }) => (
  <div>
    <h2>Flow List</h2>
    <ul>
      {flows.map((flow) => (
        <li key={flow.name}>
          {flow.name}
          <button onClick={() => onRunFlow(flow.name)}>Run Flow</button>
        </li>
      ))}
    </ul>
  </div>
);

export default FlowList;
