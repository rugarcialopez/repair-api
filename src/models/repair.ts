  
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

    user: {
      type: Schema.Types.Mixed
    },

    comments: [{type: String, default: [] }],
    
    repairState: {
      type: RepairStates,
    }

}, { timestamps: true });

const Repair = model<IRepairDocument>('Repair', repairSchema, 'repairs');

export default Repair;