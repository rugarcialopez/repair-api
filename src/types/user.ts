import { Document } from 'mongoose';

export interface IUserDocument extends Document {
    fullName: string;
    email: string;
    password: string;
    role: string;
}