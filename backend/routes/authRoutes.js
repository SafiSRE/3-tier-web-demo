// backend/routes/authRoutes.js - REVISED

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// Helper function to sign a token with role
function signToken(user) {
    return jwt.sign(
        { id: user._id, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
    );
}

// EXISTING: Customer registration (Ensures role is 'customer')
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({error: 'Missing fields'});
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({error: 'User exists'});
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: 'customer' }); 
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

// EXISTING: Customer login (Verifies role is 'customer')
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({error: 'Missing fields'});
    const user = await User.findOne({ email });
    if(!user || user.role !== 'customer') return res.status(400).json({error: 'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({error: 'Invalid credentials'});
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

// NEW: Owner registration endpoint
router.post('/owner/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({error: 'Missing fields'});
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({error: 'User exists'});
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: 'owner' }); 
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

// REVISED: Owner login endpoint (CRITICAL CHANGE: Restricts to 'owner' role only)
router.post('/owner/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({error: 'Missing fields'});
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) return res.status(400).json({error: 'Invalid credentials'});
    
    // CRITICAL LOGIC: Must be 'owner'. Admins must use /admin/login now.
    if (user.role !== 'owner') {
      return res.status(400).json({error: 'Invalid credentials'});
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({error: 'Invalid credentials'});
    
    // If successful, sign the token with the correct role ('owner')
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

// NEW: Admin login endpoint (Dedicated route for 'admin' role)
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({error: 'Missing fields'});
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({error: 'Invalid credentials'});
    
    // CRITICAL LOGIC: Must be 'admin'
    if (user.role !== 'admin') { 
      return res.status(400).json({error: 'Invalid credentials'});
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({error: 'Invalid credentials'});
    
    const token = signToken(user); // Signs token with {id, role: 'admin'}
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

router.post('/admin/setup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if admin already exists
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({error: 'Admin user exists. Use login.'});

    const passwordHash = await bcrypt.hash(password, 10);
    // Create user with 'admin' role
    const user = await User.create({ name, email, passwordHash, role: 'admin' }); 
    res.json({ success: true, message: 'Admin setup successful. Restart your server.' });
  } catch (err) {
    res.status(500).json({error: 'Server error'});
  }
});

export default router;
