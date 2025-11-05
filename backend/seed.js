import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Homestay from './models/Homestay.js';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vista';

const homestays = [
  { name: "Dolphin Homestay", pricePerNight: 1200 },
  { name: "Ananya Homestay", pricePerNight: 800 },
  { name: "Humsafar Homestay", pricePerNight: 950 },
  { name: "Northeast Hotel", pricePerNight: 1100 },
  { name: "Diksha Lodge", pricePerNight: 700 },
  { name: "Sudipa Homestay", pricePerNight: 900 },
  { name: "Shillong Guest House", pricePerNight: 1500 },
  { name: "Kings Homestay", pricePerNight: 1300 },
  { name: "Raj Lodge", pricePerNight: 650 },
  { name: "Apsara Guest House", pricePerNight: 750 }
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to Mongo');
  await Homestay.deleteMany({});
  const inserted = [];
  for (let i=0;i<homestays.length;i++) {
    const base = homestays[i];
    const images = [
      `/assets/homestays/${i+1}_1.jpg`,
      `/assets/homestays/${i+1}_2.jpg`,
      `/assets/homestays/${i+1}_3.jpg`
    ];
    const doc = await Homestay.create({
      ...base,
      images,
      description: `Beautiful stay at ${base.name}`
    });
    inserted.push(doc);
  }
  console.log('Seeded', inserted.length, 'homestays');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
