import { Response, Request } from 'express';
import moment from 'moment';
import { ObjectId } from 'bson';
import Repair, { RepairStates } from '../../models/repair';
import User, { IUser } from '../../models/user';
import { IRepairDocument } from '../../types/repair';

const getRepairs = async (req: Request, res: Response): Promise<void> => {
  try {
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

const addRepair = async (req: Request, res: Response): Promise<void> => {
  try {
    //Check if description, date and time are set
    const { description, date, time, userId, comment } = req.body;
    if (!(description && date && time && userId)) {
      res.status(400).send({ message: 'description, date, time and user are required' });
      return;
    }
    let _userId;
    try {
      _userId = new ObjectId(userId);
    } catch (error) {
      res.status(400).send({ message: 'User is not valid' });
      return;
    }
    const user : IUser | null = await User.findById(_userId);
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
      },
      comments: comment ? [comment] : []
    }
    const newRepair = new Repair(newRepairObj);
    await newRepair.save();
    res.status(201).json({ message: 'Repair added' });
  } catch (error) {
    res.status(500).send(error);
  }
}

const updateRepair = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
        params: { id },
        body,
    } = req;
    await Repair.findByIdAndUpdate(
      { _id: id },
      body
    );
    res.status(200).json({ message: 'Repair updated'});
  } catch (error) {
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

export { getRepairs, addRepair, updateRepair, deleteRepair };