// backend/routes/contactRoutes.js
import express from 'express';
import Contact from '../models/Contact.js';
const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
    const doc = await Contact.create({ name, email, message });
    res.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error('contact save error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
