import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

import { User } from '../Models/user.model'
import CustomError from '../Utils/CustomError.util';


// ---------------------------------- register by form ----------------------------------


const registerUserByForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
        const checkUserExists = await User.findOne({ email: req.body.email });
        if (checkUserExists) throw new CustomError('This E-mail already exists', 400);
        const userName = (req.body.userName && req.body.userName[0]) || (req.body.firstName + ' ' + req.body.lastName).toLowerCase();
        const password = req.body.password[0];
        const confirmPassword = req.body.confirmPassword[0];
        if (password !== confirmPassword) throw new CustomError('Password and Confirm Password does not match', 400);
        const newUser = await User.create({
            userName: userName,
            firstName: req.body.firstName && req.body.firstName[0] || '',
            lastName: req.body.lastName && req.body.lastName[0] || '',
            provider: 'form',
            email: req.body.email && req.body.email[0],
            // photo: photo,
            password: password,
            confirmPassword: confirmPassword,
            rememberMe: req.body.rememberMe && req.body.rememberMe[0]
        });
        if (!newUser) throw new CustomError('internal server error', 500);
        res.status(201).send(newUser);
    } catch (err: any) {
        next(err);
    };
};


// ---------------------------------- login user ----------------------------------


const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.email || !req.body.password) throw new CustomError('Please provide email and password', 400)
        const userAuthentication = await User.findOne({ email: req.body.email });
        if (!userAuthentication) throw new CustomError('Incorrect Email or Password', 401);
        const isPasswordValid = userAuthentication.verifyPassword(req.body.password);
        if (!isPasswordValid) throw new CustomError('Incorrect Email or Password', 401);
        const expiresInMilliseconds: number = req.body.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
        const token = jwt.sign({ id: userAuthentication._id }, process.env.JWT_SECRET as string, { expiresIn: expiresInMilliseconds });
        if (req.body.rememberMe) {
            userAuthentication.token = token;
            await userAuthentication.save();
        };
        console.log(expiresInMilliseconds);
        console.log(token);
        // res.header('auth-token', token);
        res.cookie('auth-token', token, { maxAge: expiresInMilliseconds, httpOnly: true });
        res.status(200).send({ token });
    } catch (err: any) {
        next(err);
    };
};



export default {
    registerUserByForm,
    login
};