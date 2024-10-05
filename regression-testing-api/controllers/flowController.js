const Flow = require('../models/Flow');

exports.createFlow = async (req, res) => {
    console.log('Incoming flow data:', req.body); // Log incoming request body
    try {
      const { name, description, steps } = req.body;
      console.log('Parsed data:', { name, description, steps }); // Log parsed data
      const newFlow = new Flow({ name, description, steps });
      await newFlow.save();
      res.status(201).json(newFlow);
    } catch (error) {
      console.error('Error saving flow:', error); // Log the actual error to see what's wrong
      res.status(500).json({ error: 'Error creating flow' });
    }
  };

exports.getFlows = async (req, res) => {
  try {
    const flows = await Flow.find({});
    res.json(flows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching flows' });
  }
};


  