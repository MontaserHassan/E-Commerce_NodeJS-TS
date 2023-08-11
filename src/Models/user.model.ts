import bcrypt from "bcrypt";
import { model, Schema, Document } from 'mongoose';

interface UserModel extends Document {
    verifyPassword(password: string): unknown;
    userName: string;
    firstName: string;
    lastName: string;
    provider: string;
    providerId: string;
    email: string;
    password: string;
    confirmPassword: string;
    rememberMe: boolean
    photo: string;
};


const userSchema = new Schema<UserModel>(
    {
        userName: {
            type: String,
            unique: true,
            minlength: 10,
            maxlength: 20
        },
        firstName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 15
        },
        lastName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 15
        },
        provider: {
            type: String,
            enum: ['github', 'google', 'facebook', 'form'],
            default: 'form',
        },
        providerId: {
            type: String,
            default: 'empty'
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        // photo: {
        //     type: String,
        //     required: true,
        // },
        password: {
            type: String,
            required: true,
        },
        confirmPassword: {
            type: String,
            required: true,
        },
        rememberMe: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.confirmPassword;
            },
        },
    }
);


userSchema.pre('save', function preSave(next) {
    this.password = bcrypt.hashSync(this.password, 10);
    this.confirmPassword = this.password;
    next();
});

userSchema.methods.verifyPassword = function verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.password);
};


const User = model<UserModel>('User', userSchema);



export {
    User,
    UserModel
};