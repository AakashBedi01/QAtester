import mongoose from 'mongoose';

const { Schema } = mongoose;

const stepSchema = new Schema({
  action: { type: String, required: true },  // 'click', 'type', 'navigate', etc.
  selector: {
    type: String,
    required() {
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
  createdAt: { type: Date, default: Date.now },
  startUrl: { type: String, required: true }
});

const Flow = mongoose.model('Flow', flowSchema);

export default Flow;
