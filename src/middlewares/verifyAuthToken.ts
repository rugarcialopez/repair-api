import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction): void => {
  //Get the jwt token from the header
  const token = <string>req.headers['token'];
  let jwtPayload;
  
  //Try to validate the token and get data
  try {
    jwtPayload = <{userId: string, role: string}>jwt.verify(token, process.env.JWT_SECRET || 'YOUR_SECRET_STRING');
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send({ message: 'Wrong token'});
    return;
  }
  //Call the next middleware or controller
  next();
};