import express from 'express';
import Homestay from '../models/Homestay.js';
const router = express.Router();

// list homestays
router.get('/', async (req, res) => {
  const list = await Homestay.find();
  res.json(list);
});

// get single
router.get('/:id', async (req, res) => {
  const h = await Homestay.findById(req.params.id);
  if(!h) return res.status(404).json({error: 'Not found'});
  res.json(h);
});

export default router;
