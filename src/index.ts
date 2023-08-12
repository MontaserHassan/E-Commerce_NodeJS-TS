import express from 'express';
import cors from 'cors';

import app from './app';
import router from './Routes/index.routes';


app.use(express.static('Public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});
app.use(router);