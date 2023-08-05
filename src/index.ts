import express from 'express';
import cors from 'cors';
import app from './app';

import router from './Routes/index.routes';


app.use(cors());
app.use(express.json());
app.use(router);