// models/Flow.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = new Schema({
  action: { type: String, required: true },  // 'click', 'type', 'navigate', etc.
  selector: {
    type: String,
    required: function () {
      // Make 'selector' required only for actions that aren't 'navigate'
      return this.action !== 'navigate';
    }
  },
  value: { type: String }  // Value to type or URL to navigate to
});

const flowSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  steps: { type: [stepSchema], required: true },  // Array of stepSchema
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flow', flowSchema);
