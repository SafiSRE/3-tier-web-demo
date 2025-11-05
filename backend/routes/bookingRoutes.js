import express from 'express';
import Booking from '../models/Booking.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  if(!auth) {
    req.userId = null;
    return next();
  }
  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.userId = data.id;
    next();
  } catch (err) {
    // treat as unauthenticated but allow guest booking
    req.userId = null;
    next();
  }
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error: 'Unauthorized'});
  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.userId = data.id;
    next();
  } catch (err) {
    return res.status(401).json({error: 'Unauthorized'});
  }
}

// create booking (auth optional - allows guest bookings)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      homestayId, fromDate, toDate, name, phone, aadhar, address, couponCode, nights, subtotal, gst, totalPrice
    } = req.body;
    const booking = await Booking.create({
      user: req.userId || null,
      homestay: homestayId,
      fromDate, toDate, name, phone, aadhar, address, couponCode, nights, subtotal, gst, totalPrice
    });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

// get bookings for logged in user
router.get('/mine', authMiddleware, async (req, res) => {
  const bookings = await Booking.find({ user: req.userId }).populate('homestay');
  res.json(bookings);
});

export default router;
