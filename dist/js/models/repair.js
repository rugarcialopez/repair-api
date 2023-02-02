"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairStates = void 0;
const mongoose_1 = require("mongoose");
var RepairStates;
(function (RepairStates) {
    RepairStates["Completed"] = "commpleted";
    RepairStates["Uncompleted"] = "uncompleted";
    RepairStates["Approved"] = "approved";
})(RepairStates = exports.RepairStates || (exports.RepairStates = {}));
const repairSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.Mixed
    },
    comments: [{ type: String, default: [] }],
    repairState: {
        type: RepairStates,
    }
}, { timestamps: true });
const Repair = mongoose_1.model('Repair', repairSchema, 'repairs');
exports.default = Repair;
