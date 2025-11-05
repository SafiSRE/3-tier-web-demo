import mongoose from 'mongoose';

const homestaySchema = new mongoose.Schema({
  name: String,
  pricePerNight: Number,
  images: [String],
  description: String
});

export default mongoose.model('Homestay', homestaySchema);
