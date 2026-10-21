import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) console.warn('JWT_SECRET is not set.');

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Task Management API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === 11000) return res.status(409).json({ success: false, message: 'Duplicate value' });
  if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: error.message });
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const start = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } else console.warn('MONGODB_URI is not set; starting without a database connection');
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
