// backend/routes/adminRoutes.js (NEW FILE)

import express from 'express';
import jwt from 'jsonwebtoken';
// IMPORTANT: Need to import models to query the database
import Homestay from '../models/Homestay.js';
import Contact from '../models/Contact.js'; 
import User from '../models/User.js'; // Needed if checking User status directly

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secretkey"; 

// --- CRITICAL Admin Authorization Middleware ---
function adminAuthMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({error: 'Unauthorized'});
    const token = auth.split(' ')[1];
    try {
      const data = jwt.verify(token, JWT_SECRET); 
      // Verification: User must have the 'admin' role
      if (data.role !== 'admin') { 
        return res.status(403).json({error: 'Forbidden: Admin access required'});
      }
      req.userId = data.id; 
      next();
    } catch (err) {
      return res.status(401).json({error: 'Unauthorized'});
    }
}
// ------------------------------------------------


// ------------------------------------------------
// A. Homestay Management (Admin Section)
// ------------------------------------------------

// GET: Retrieve all homestays (Approved and Unapproved)
router.get('/homestays', adminAuthMiddleware, async (req, res) => {
    try {
        // Use a configuration object for populate for enhanced resilience
        let listings = await Homestay.find()
            .populate({
                path: 'owner',
                select: 'name email',
                // CRITICAL FIX: Stops the server from crashing if a reference ID is invalid
                options: { strictPopulate: false } 
            })
            .exec(); 

        // Sanitize the list to remove entries where population failed (owner is null)
        listings = listings.filter(l => l.owner !== null);

        res.json(listings);
    } catch (err) {
        // This catch block prevents the entire Node server from crashing due to any Mongoose error.
        console.error('Admin Homestay Fetch/Populate Error (Final Check):', err);
        
        // Respond with 500 status and a specific error message to the frontend.
        res.status(500).json({ error: 'Failed to fetch listings due to a backend database error. Please verify the Homestay schema and seeded data.' });
    }
});


// ------------------------------------------------
// B. Support & Listing Requests (Support Admin Section)
// ------------------------------------------------

// GET: Retrieve all contact/listing submissions
router.get('/requests', adminAuthMiddleware, async (req, res) => {
    // Fetch all contacts/requests, sorted newest first
    const requests = await Contact.find().sort({ createdAt: -1 });
    res.json(requests);
});

// DELETE: Mark a request as processed/resolved
router.delete('/requests/:id', adminAuthMiddleware, async (req, res) => {
    try {
      const result = await Contact.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Request not found' });
      res.json({ success: true, message: 'Request marked as processed.' });
    } catch(err) {
       res.status(500).json({ error: 'Server error deleting request' });
    }
});


export default router;
