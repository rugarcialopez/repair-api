import { Response, Request } from 'express';
import moment from 'moment';
import Repair, { RepairStates } from '../../models/repair';
import User, { IUser } from '../../models/user';
import { IRepairDocument } from '../../types/repair';

const getRepairs = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = res.locals.jwtPayload.role;
    const userId = res.locals.jwtPayload.userId;
    const filter = role === 'manager' ? {} : { 'user.id': userId};
    const repairs: IRepairDocument[] = await Repair.find(filter);
    const transformedRepairs = (repairs || []).map((repair: IRepairDocument) => ({
      id: repair._id.toString(),
      description: repair.description,
      date: moment(repair.date).format('YYYY-MM-DD'),
      time: repair.time
    }));
    res.status(200).json({ repairs: transformedRepairs });
  } catch (error) {
    res.status(500).send(error);
  }
}

const getRepair = async (req: Request, res: Response): Promise<void> => {
  try {
    const { params: { id } } = req;
    const repairDB = await Repair.findById({ _id: id });
    if (!repairDB) {
      res.status(401).send({ message: 'Repair does not exist'});
      return;
    }
    const repair = {
      id: repairDB._id.toString(),
      description: repairDB.description,
      date: moment(repairDB.date).format('YYYY-MM-DD'),
      time: repairDB.time,
      userId: repairDB.user.id
    }
    res.status(200).json({repair});
  } catch (error) {
    res.status(500).send(error);
  }
}

const addRepair = async (req: Request, res: Response): Promise<void> => {
  try {
    //Check if description, date and time are set
    const { description, date, time, userId } = req.body;
    if (!(description && date && time && userId)) {
      res.status(400).send({ message: 'description, date, time and user are required' });
      return;
    }
    const user : IUser | null = await User.findById({_id: userId});
    if (!user) {
      res.status(422).send({ message: 'user does not exist' });
      return;
    }

    const newRepairObj = {
      description,
      date: new Date(date),
      time,
      repairState: RepairStates.Uncompleted,
      user: {
        id: user._id.toString(),
        fullName: user.fullName
      }
    }
    const newRepair = new Repair(newRepairObj);
    await newRepair.save();
    res.status(201).json({ message: 'Repair added' });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(422).send({ message: 'Userid incorrect' });
      return;
    }
    res.status(500).send(error);
  }
}

const updateRepair = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
        params: { id },
        body,
    } = req;
    const repairDB: IRepairDocument | null = await Repair.findById(id);
    if (!repairDB) {
      res.status(422).send({ message: 'Repair does not exist' });
      return;
    }
    const updatedRepair = {
      description: body.description,
      time: body.time,
      date: new Date(body.date),
      repairState: RepairStates.Uncompleted,
      user: repairDB.user
    };
    if (body.userId !== repairDB.user.id) {
      const userDB: IUser | null = await User.findById(body.userId);
      if (!userDB) {
        res.status(422).send({ message: 'user does exist' });
        return;
      }
      updatedRepair.user = {
        id: userDB._id.toString(),
        fullName: userDB.fullName
      }
    }
    await Repair.findByIdAndUpdate(
      { _id: id },
      updatedRepair
    );
    res.status(200).json({ message: 'Repair updated'});
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(422).send({ message: 'Repairid incorrect' });
      return;
    }
    res.status(500).send(error);
  }
}

const deleteRepair = async (req: Request, res: Response): Promise<void> => {
  try {
    await Repair.findByIdAndRemove(req.params.id);
    const repairs: IRepairDocument[] = await Repair.find();
    const transformedRepairs = (repairs || []).map((repair: IRepairDocument) => ({
      id: repair._id.toString(),
      description: repair.description,
      date: moment(repair.date).format('YYYY-MM-DD'),
      time: repair.time
    }));
    res.status(200).json({ repairs: transformedRepairs });
  } catch (error) {
    res.status(500).send(error);
  }
}

export { getRepairs, addRepair, updateRepair, deleteRepair, getRepair };