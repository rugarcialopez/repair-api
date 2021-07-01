import { Response, Request } from 'express';
import User, { IUser } from '../../models/user';
import { IUserDocument } from '../../types/user';

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    //Get the user ID from previous midleware
    const userId = res.locals.jwtPayload.userId;
    const role = req.query.role as string;
    const filter = role ? { _id: { $ne: userId }, role: role} : { _id: { $ne: userId }};
    const users: IUser[] = await User.find(filter);
    const transformedUsers =  (users || []).map((user: IUser) => (
      {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }
    ));
    res.status(200).json({ users: transformedUsers });
  } catch (error) {
    res.status(500).send(error);
  }
}

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
        params: { id }
    } = req;
    const userDB = await User.findById({ _id: id });
    if (!userDB) {
      res.status(401).send({ message: 'User does not exist'});
      return;
    }
    const user = {
      id,
      fullName: userDB.fullName,
      email: userDB.email,
      role: userDB.role
    }
    res.status(200).json({user});
  } catch (error) {
    res.status(500).send(error);
  }
}

const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Pick<IUserDocument, 'fullName' | 'email' | 'password' | 'role'>;
    //Check if fullName, email, password and role are set
    const { fullName, email, password, role } = req.body;
    if (!(fullName && email && password && role)) {
      res.status(400).send({ message: 'fullName, email, password and role are required' });
      return;
    }

    const userDB: IUser | null = await User.findOne({email: email.toLowerCase()});
    if (userDB) {
      res.status(401).send({ message: 'User already exists'});
      return;
    }

    const user: IUser = new User({
      fullName: body.fullName,
      email: body.email.toLowerCase(),
      password: User.hashPassword(body.password),
      role: body.role
    });
  
    await user.save();
    res.status(201).json({ message: 'User added' });
  } catch (error) {
    res.status(500).send(error);
  }
}

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
        params: { id },
        body,
    } = req;
    await User.findByIdAndUpdate(
      { _id: id },
      body
    );
    res.status(200).json({ message: 'User updated'});
  } catch (error) {
    res.status(500).send(error);
  }
}

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = res.locals.jwtPayload.userId;
  try {
    await User.findByIdAndRemove(req.params.id);
    const users: IUser[] = await User.find({ _id: { $ne: userId }});
    const transformedUsers =  (users || []).map((user: IUser) => (
      {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }
    ));
    res.status(200).json({ users: transformedUsers });
  } catch (error) {
    res.status(500).send(error);
  }
}

export { getUsers, getUser, addUser, updateUser, deleteUser };