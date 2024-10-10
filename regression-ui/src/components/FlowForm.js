import React, { useState } from 'react';
import { createFlow } from '../api';

const FlowForm = () => {
  const [flowName, setFlowName] = useState('');
  const [startUrl, setStartUrl] = useState('');
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
    const newFlow = { name: flowName, startUrl, steps };

    try {
      await createFlow(newFlow);
      alert('Flow created successfully!');
      setFlowName('');
      setStartUrl('');
      setSteps([{ action: '', selector: '', value: '' }]);
    } catch (error) {
      console.error('Error creating flow:', error.message);
      alert('Failed to create flow.');
    }
  };

  return (
    <div>
      <h2>Create New Flow</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Flow Name:
          <input
            type="text"
            name="flowName"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            required
          />
        </label>
        <label>
          Start URL:
          <input
            type="url"
            name="startUrl"
            value={startUrl}
            onChange={(e) => setStartUrl(e.target.value)}
            required
          />
        </label>

        <h3>Steps:</h3>
        {steps.map((step, index) => (
          <div key={index}>
            <label>
              Action:
              <input
                type="text"
                name="action"
                value={step.action}
                onChange={(e) => handleStepChange(index, e)}
                required
              />
            </label>
            <label>
              Selector:
              <input
                type="text"
                name="selector"
                value={step.selector}
                onChange={(e) => handleStepChange(index, e)}
                required={step.action !== 'navigate'}
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
