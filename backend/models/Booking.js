import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  homestay: { type: mongoose.Schema.Types.ObjectId, ref: "Homestay" },
  fromDate: Date,
  toDate: Date,
  name: String,
  phone: String,
  aadhar: String,
  address: String,
  couponCode: String,
  nights: Number,
  subtotal: Number,
  gst: Number,
  totalPrice: Number
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
