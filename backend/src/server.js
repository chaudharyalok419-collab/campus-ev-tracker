// Main server file - the entry point for our backend

import 'express-async-errors';
import express from 'express';
import cors    from 'cors';
import dotenv  from 'dotenv';

dotenv.config();

import driverRoutes  from './routes/drivers.js';
import vehicleRoutes from './routes/vehicles.js';
import requestRoutes from './routes/requests.js';
import adminRoutes   from './routes/admin.js';
import authRoutes    from './routes/auth.js';

import { errorHandler } from './middleware/errorHandler.js';

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'https://campus-ev-tracker.vercel.app',
  ],
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Campus EV Tracker API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth',     authRoutes);
app.use('/api/v1/drivers',  driverRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/admin',    adminRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`
  Campus EV Tracker Backend
  Running on http://localhost:${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

export default app;
