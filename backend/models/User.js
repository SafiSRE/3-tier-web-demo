// backend/models/User.js - FINAL ENHANCED (Admin Role Added)

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  // NEW ENUM VALUE: 'admin'
  role: { type: String, enum: ['customer', 'owner', 'admin'], default: 'customer' } 
}, { timestamps: true });

export default mongoose.model('User', userSchema);