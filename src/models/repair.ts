  
import { IRepairDocument } from '../types/repair';
import { model, Schema } from 'mongoose';

export enum RepairStates {
  Completed = 'commpleted',
  Uncompleted = 'uncompleted',
  Approved = 'approved',
}

const repairSchema: Schema = new Schema({
    description: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: Number,
        required: true
    },

    assignedTo: {
      type: Object
    },

    commnents: {
      type: String,
    },
    
    repairState: {
      type: RepairStates,
    }

}, { timestamps: true });

const Repair = model<IRepairDocument>('Repair', repairSchema, 'repairs');

export default Repair;