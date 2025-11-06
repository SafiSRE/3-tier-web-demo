// backend/routes/homestayRoutes.js - ENHANCED

import express from 'express';
import Homestay from '../models/Homestay.js';
import jwt from 'jsonwebtoken'; 
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey"; 

// --- Owner Auth Middleware (Checks token and role) ---
function ownerAuthMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error: 'Unauthorized'});
  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET); 
    if (data.role !== 'owner') { 
      return res.status(403).json({error: 'Forbidden: Owner role required'});
    }
    req.userId = data.id; // Now available as the owner ID
    next();
  } catch (err) {
    return res.status(401).json({error: 'Unauthorized'});
  }
}
// ----------------------------------------------------


// EXISTING: list homestays (Public)
router.get('/', async (req, res) => {
  const list = await Homestay.find();
  res.json(list);
});

// EXISTING: get single (Public)
router.get('/:id', async (req, res) => {
  const h = await Homestay.findById(req.params.id);
  if(!h) return res.status(404).json({error: 'Not found'});
  res.json(h);
});


// NEW: GET all homestays owned by the authenticated owner (Owner Dashboard)
router.get('/owner/mine', ownerAuthMiddleware, async (req, res) => {
  const listings = await Homestay.find({ owner: req.userId });
  res.json(listings);
});

// NEW: POST create new homestay (Owner Protected)
router.post('/', ownerAuthMiddleware, async (req, res) => {
  try {
    const listingData = req.body;
    // Inject the authenticated owner ID
    const homestay = await Homestay.create({ ...listingData, owner: req.userId });
    res.json(homestay);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

// NEW: PUT update a homestay (Owner Protected + Ownership Check)
router.put('/:id', ownerAuthMiddleware, async (req, res) => {
  try {
    const { name, pricePerNight, images, description, amenities } = req.body;
    
    // Ownership Check: CRITICAL SECURITY STEP
    const homestay = await Homestay.findOne({ _id: req.params.id, owner: req.userId });
    if (!homestay) return res.status(404).json({ error: 'Homestay not found or unauthorized' });

    // Update fields
    homestay.set({ name, pricePerNight, images, description, amenities });
    await homestay.save();
    res.json(homestay);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

// NEW: DELETE a homestay (Owner Protected + Ownership Check)
router.delete('/:id', ownerAuthMiddleware, async (req, res) => {
  try {
    // Ownership Check: CRITICAL SECURITY STEP
    const result = await Homestay.deleteOne({ _id: req.params.id, owner: req.userId });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Homestay not found or unauthorized' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

export default router;