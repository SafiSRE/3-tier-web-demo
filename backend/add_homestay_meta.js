// backend/add_homestay_meta.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Homestay from './models/Homestay.js';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vista';

async function run(){
  await mongoose.connect(MONGO_URI);
  const hs = await Homestay.find();
  for(let h of hs){
    h.rating = (Math.random()*1.5 + 4).toFixed(1); // 4.0-5.5 -> clamp later
    h.rating = Math.min(5, Math.max(3.5, Number(h.rating)));
    h.reviews = Math.floor(Math.random()*120) + 3;
    h.amenities = ['wifi','breakfast','sea'];
    await h.save();
    console.log('updated', h.name);
  }
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
