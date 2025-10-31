const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','member'], default: 'member' },
  clubsJoined: [{ type: Schema.Types.ObjectId, ref: 'Club' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
