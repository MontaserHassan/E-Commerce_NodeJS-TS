import { NextFunction, Request, Response } from 'express';

import CustomError from '../Utils/CustomError.util'; // Replace with the correct path to your CustomError file


export default function errorHandler(err: Error | CustomError, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
};  