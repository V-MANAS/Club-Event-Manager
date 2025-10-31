const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EventSchema = new Schema({
  clubId: { type: Schema.Types.ObjectId, ref: 'Club', index: true },
  title: { type: String, required: true, index: true },
  description: String,
  date: Date,
  location: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
