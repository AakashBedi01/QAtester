import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html'; // Input sanitization library

const { Schema } = mongoose;

const stepSchema = new Schema({
  action: { type: String, required: true },  // 'click', 'type', 'navigate', etc.
  selector: {
    type: String,
    required() {
      return this.action !== 'navigate';  // Make selector required for non-navigate actions
    }
  },
  value: { type: String },  // Value to type or URL to navigate to
});

// Middleware to sanitize inputs
stepSchema.pre('save', function (next) {
  if (this.value) {
    this.value = sanitizeHtml(this.value);  // Sanitize the input to prevent XSS
  }
  next();
});

const flowSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  steps: [stepSchema]
});

const Flow = mongoose.model('Flow', flowSchema);

export default Flow;
