import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import app from './app';

import router from './Routes/index.routes';


app.use(express.static('Public'));
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

app.use(router);