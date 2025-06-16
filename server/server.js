import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import studentRoutes from './routes/studentRoutes.js';
import connectDB from './config/db.js';
import { startCFDataSyncJob } from './cron/fetchCFData.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
startCFDataSyncJob();
connectDB();

app.use('/api/students', studentRoutes);

const PORT = process.env.PORT||5000;
app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`));