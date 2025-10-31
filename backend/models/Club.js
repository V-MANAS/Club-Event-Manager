const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ClubSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  description: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Club', ClubSchema);
