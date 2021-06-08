import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user";

export const verifyRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //Get the user ID from previous midleware
    const userId = res.locals.jwtPayload.userId;
    //Get user role from the database
    const user: IUser | null = await User.findById(userId);
    //Check if array of authorized roles includes the user's role
    if (user && roles.indexOf(user.role) > -1) {
      next();
    } else {
      res.status(401).send({ message: 'Wrong role'});
      return;
    }
  };
};