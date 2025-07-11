import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true },
  phoneNumber: { type: String },
  cfHandle: { type: String, required: true, unique: true },

  curRating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  lastSyncedAt: { type: Date, default: null },
  emailDisabled: { type: Boolean, default: false },
  reminderCount: { type: Number, default: 0 },

  // Extra CF profile info
  avatar: { type: String, default: '' },
  rank: { type: String, default: '' },
  maxRank: { type: String, default: '' },
  cfName: { type: String, default: '' },

}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
