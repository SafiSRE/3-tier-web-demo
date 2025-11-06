// backend/models/Homestay.js - ENHANCED

import mongoose from 'mongoose';

const homestaySchema = new mongoose.Schema({
  name: String,
  pricePerNight: Number,
  images: [String],
  description: String,
  // NEW FIELD: Link homestay to the User/Owner who created it
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  rating: Number, 
  reviews: Number,
  amenities: [String]
});

export default mongoose.model('Homestay', homestaySchema);