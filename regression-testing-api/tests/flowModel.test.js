// tests/flowModel.test.js
import Flow from '../models/Flow';

describe('Flow Model Validation', () => {

  it('should pass when valid data is provided', async () => {
    const validFlow = new Flow({
      name: 'Test Flow',
      description: 'A test flow description',
      steps: [
        { action: 'click', selector: '#button' },
        { action: 'navigate', value: 'https://example.com' }
      ]
    });

    const result = await validFlow.validate();
    expect(result).toBeUndefined();  // Passes validation
  });

  it('should fail when required fields are missing', async () => {
    const invalidFlow = new Flow({
      description: 'A test flow without name',
      steps: []
    });

    let error;
    try {
      await invalidFlow.validate();
    } catch (e) {
      error = e;
    }
    
    expect(error.errors.name).toBeDefined();  // Expected to fail
  });

  it('should fail when selector is missing for click action', async () => {
    const invalidFlow = new Flow({
      name: 'Invalid Flow',
      steps: [{ action: 'click' }]
    });

    let error;
    try {
      await invalidFlow.validate();
    } catch (e) {
      error = e;
    }

    expect(error.errors['steps.0.selector']).toBeDefined();  // Expected to fail
  });
});
