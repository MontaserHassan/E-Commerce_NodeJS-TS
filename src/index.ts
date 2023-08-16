import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multiparty from 'multiparty';
// import fileUpload from 'express-fileupload'; // Import express-fileupload

import app from './app';
import router from './Routes/index.routes';


app.use(express.static('Public'));
app.use(cors());
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data')) {
        const form = new multiparty.Form();

        form.parse(req, (err: Error, fields: any, files: any) => {
            if (err) {
                console.error('Error parsing form data:', err);
                return res.status(400).json({ error: 'Error parsing form data' });
            }
            req.body = fields;
            req.files = files;
            // console.log('req.body from middleware', req.body)
            // console.log('req.files from middleware', req.files)
            next();
        });
    } else {
        next();
    }
});

app.use(router);