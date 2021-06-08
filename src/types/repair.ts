import { Document } from 'mongoose';

export interface IRepairDocument extends Document {
    description: string;
    date: Date;
    time: number;
    assignedTo: { userId: string, fullName: string };
    comments: string;
    repairState: string;
}