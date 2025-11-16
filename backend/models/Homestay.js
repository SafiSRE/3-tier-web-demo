// backend/models/Homestay.js - REVISED (isApproved added)

import mongoose from 'mongoose';

const homestaySchema = new mongoose.Schema({
  name: String,
  pricePerNight: Number,
  images: [String],
  description: String,
  // Link homestay to the User/Owner who created it
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  rating: Number, 
  reviews: Number,
  amenities: [String],
  // NEW FIELD: Admin approval status, defaults to false
  isApproved: { type: Boolean, default: false } 
});

export default mongoose.model('Homestay', homestaySchema);