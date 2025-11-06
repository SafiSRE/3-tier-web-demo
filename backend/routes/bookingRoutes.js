// backend/routes/bookingRoutes.js - ENHANCED

import express from 'express';
import Booking from '../models/Booking.js';
import Homestay from '../models/Homestay.js'; // NEW import
import jwt from 'jsonwebtoken';
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// --- EXISTING Middleware (keeping local definitions for simplicity) ---
function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  // ... existing optionalAuth logic ...
  if(!auth) { req.userId = null; return next(); }
  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.userId = data.id;
    next();
  } catch (err) {
    req.userId = null;
    next();
  }
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  // ... existing authMiddleware logic ...
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

// --- NEW Owner Auth Middleware ---
function ownerAuthMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({error: 'Unauthorized'});
    const token = auth.split(' ')[1];
    try {
      const data = jwt.verify(token, JWT_SECRET); 
      if (data.role !== 'owner') { 
        return res.status(403).json({error: 'Forbidden: Owner role required'});
      }
      req.userId = data.id; // Owner ID
      next();
    } catch (err) {
      return res.status(401).json({error: 'Unauthorized'});
    }
}
// -------------------------------------------------------------------


// EXISTING: create booking (auth optional)
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

// EXISTING: get bookings for logged in customer
router.get('/mine', authMiddleware, async (req, res) => {
  const bookings = await Booking.find({ user: req.userId }).populate('homestay');
  res.json(bookings);
});


// NEW: Get bookings for homestays owned by the authenticated owner
router.get('/owner/all', ownerAuthMiddleware, async (req, res) => {
  try {
    // 1. Find all homestays belonging to the owner
    const ownerHomestays = await Homestay.find({ owner: req.userId }).select('_id');
    const homestayIds = ownerHomestays.map(h => h._id);

    // 2. Find all bookings for those homestays
    const bookings = await Booking.find({ homestay: { $in: homestayIds } }).populate('homestay');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;