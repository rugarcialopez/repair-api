import { Response, Request } from 'express';
import Repair from '../../models/repair';
import { IRepairDocument } from '../../types/repair';

const getRepairs = async (req: Request, res: Response): Promise<void> => {
  try {
    const repairs: IRepairDocument[] = await Repair.find();
    const transformedRepairs = (repairs || []).map((repair: IRepairDocument) => ({
      id: repair._id.toString(),
      description: repair.description,
      date: repair.date,
      time: repair.time
    }));
    res.status(200).json({ repairs: transformedRepairs });
  } catch (error) {
    res.status(500).send(error);
  }
}

const addRepair = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Pick<IRepairDocument, 'description' | 'date' | 'time'>;
    //Check if description, date and time are set
    const { description, date, time } = body;
    if (!(description && date && time)) {
      res.status(400).send({ message: 'description, date and time are required' });
      return;
    }

    const repair = new Repair({
      description,
      date: new Date(date),
      time,
    });
  
    await repair.save();
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
    res.status(200).json({ message: 'Repair deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
}

export { getRepairs, addRepair, updateRepair, deleteRepair };