const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RegSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  registeredAt: { type: Date, default: Date.now }
});

// prevent duplicate registration
RegSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegSchema);
