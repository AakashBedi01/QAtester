// tests/flowService.test.js
import { executeFlow } from '../services/flowService';
import puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('Flow Service', () => {
  let mockBrowser, mockPage;

  beforeEach(() => {
    mockPage = {
      click: jest.fn(),
      type: jest.fn(),
      goto: jest.fn(),
      waitForSelector: jest.fn().mockResolvedValueOnce(true),
    };
    
    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };

    puppeteer.launch.mockResolvedValue(mockBrowser);
  });

  it('should execute a valid flow', async () => {
    const flow = {
      name: 'Test Flow',
      steps: [
        { action: 'click', selector: '#button' },
        { action: 'type', selector: '#input', value: 'text' }
      ]
    };

    await executeFlow(flow);

    expect(mockPage.click).toHaveBeenCalledWith('#button');
    expect(mockPage.type).toHaveBeenCalledWith('#input', 'text');
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it('should fail if Puppeteer action fails', async () => {
    mockPage.click.mockRejectedValue(new Error('Click failed'));

    const flow = {
      name: 'Test Flow',
      steps: [{ action: 'click', selector: '#button' }]
    };

    await expect(executeFlow(flow)).rejects.toThrow('Click failed');
  });
});
