import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
console.log('Static assets available at /assets (backend)');
export default app;
