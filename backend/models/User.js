// backend/models/User.js - ENHANCED

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  // NEW FIELD: 'customer' or 'owner'
  role: { type: String, enum: ['customer', 'owner'], default: 'customer' } 
}, { timestamps: true });

export default mongoose.model('User', userSchema);