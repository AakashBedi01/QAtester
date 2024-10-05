// src/components/FlowForm.js
import React, { useState } from 'react';
import { createFlow } from '../api';

const FlowForm = () => {
  const [flowName, setFlowName] = useState('');
  const [steps, setSteps] = useState([{ action: '', selector: '', value: '' }]);

  const handleStepChange = (index, event) => {
    const updatedSteps = [...steps];
    updatedSteps[index][event.target.name] = event.target.value;
    setSteps(updatedSteps);
  };

  const addStep = () => {
    setSteps([...steps, { action: '', selector: '', value: '' }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newFlow = { name: flowName, steps };
    await createFlow(newFlow);
    alert('Flow created successfully!');
    setFlowName('');
    setSteps([{ action: '', selector: '', value: '' }]);
  };

  return (
    <div>
      <h2>Create New Flow</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Flow Name:
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            required
          />
        </label>
        {steps.map((step, index) => (
          <div key={index}>
            <label>
              Action:
              <select name="action" value={step.action} onChange={(e) => handleStepChange(index, e)}>
                <option value="navigate">Navigate</option>
                <option value="click">Click</option>
                <option value="type">Type</option>
                <option value="hover">Hover</option>
                <option value="scroll">Scroll</option>
                <option value="assert">Assert</option>
              </select>
            </label>
            <label>
              Selector:
              <input
                type="text"
                name="selector"
                value={step.selector}
                onChange={(e) => handleStepChange(index, e)}
              />
            </label>
            <label>
              Value:
              <input
                type="text"
                name="value"
                value={step.value}
                onChange={(e) => handleStepChange(index, e)}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addStep}>
          Add Step
        </button>
        <button type="submit">Create Flow</button>
      </form>
    </div>
  );
};

export default FlowForm;
