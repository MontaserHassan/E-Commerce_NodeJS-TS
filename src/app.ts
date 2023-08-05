import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './Config/database.config';


const app = express();
connectDB(app);


export default app;