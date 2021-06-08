  
import { IUserDocument } from '../types/user';
import { model, Model, Schema } from 'mongoose';
import * as bcrypt from "bcryptjs";

export enum Role {
  Manager = 'manager',
  User = 'user',
}

export interface IUser extends IUserDocument {
  checkIfPasswordIsValid(password: string): boolean; 
}

export interface IUserModel extends Model<IUser> {
  hashPassword(planPassword: string): string;
}

const userSchema: Schema = new Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
      type: Role,
      required: true
    }

}, { timestamps: true });

userSchema.statics.hashPassword = (plainPassword: string): string => {
  return bcrypt.hashSync(plainPassword, 8);
}
 
userSchema.methods.checkIfPasswordIsValid = function (password) {
  return bcrypt.compareSync(password, this.get('password'));
};

const User: IUserModel = model<IUser, IUserModel>('User', userSchema, 'users');

export default User;