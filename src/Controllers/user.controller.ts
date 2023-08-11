import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

import { User, UserModel } from '../Models/user.model'
import CustomError from '../Utils/CustomError.util';


// ---------------------------------- register by form ----------------------------------


const registerUserByForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body); // {}
        let checkUserExists = await User.findOne({ email: req.body.email });
        if (checkUserExists) throw new CustomError('This E-mail already exists', 400);
        if (req.body.password !== req.body.confirmPassword) throw new CustomError('Password and Confirm Password does not match', 400);
        const userName = req.body.userName || (String(req.body.firstName) + ' ' + String(req.body.lastName)).toLowerCase();
        const newUser = await User.create({
            userName: userName,
            firstName: (req.body.firstName || '').toLowerCase(),
            lastName: (req.body.lastName || '').toLowerCase(),
            provider: 'form',
            email: req.body.email,
            // photo: photo,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            rememberMe: req.body.rememberMe
        });
        console.log(newUser)
        if (!newUser) throw new CustomError('internal server error', 500);
        res.status(201).send(newUser);
    } catch (err: any) {
        next(err);
    };
};


// ---------------------------------- login user ----------------------------------


const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userAuthentication = await User.findOne({ email: req.body.email }) as UserModel;
        if (!userAuthentication) throw new CustomError('Incorrect Email or Password', 401);
        const isPasswordValid = userAuthentication.verifyPassword(req.body.password);
        if (!isPasswordValid) throw new CustomError('Incorrect Email or Password', 401);
        const token = jwt.sign({ id: userAuthentication._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        res.header('auth-token', token);
        res.status(200).send({ token });
    } catch (err: any) {
        next(err);
    };
};



export default {
    registerUserByForm,
    login
};