"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMark = exports.addComment = exports.getAllComments = exports.markRepair = exports.checkAvailability = exports.getRepair = exports.deleteRepair = exports.updateRepair = exports.addRepair = exports.getRepairs = void 0;
const moment_1 = __importDefault(require("moment"));
const repair_1 = __importStar(require("../../models/repair"));
const user_1 = __importStar(require("../../models/user"));
const getRepairs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = res.locals.jwtPayload.role;
        const userId = res.locals.jwtPayload.userId;
        const filter = role === 'manager' ? {} : { 'user.id': userId };
        const repairs = yield repair_1.default.find(filter);
        const transformedRepairs = (repairs || []).map((repair) => ({
            id: repair._id.toString(),
            description: repair.description,
            date: moment_1.default(repair.date).format('YYYY-MM-DD'),
            time: repair.time,
            repairState: repair.repairState
        }));
        res.status(200).json({ repairs: transformedRepairs });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getRepairs = getRepairs;
const getRepair = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id } } = req;
        const repairDB = yield repair_1.default.findById({ _id: id });
        if (!repairDB) {
            res.status(401).send({ message: 'Repair does not exist' });
            return;
        }
        const repair = {
            id: repairDB._id.toString(),
            description: repairDB.description,
            date: moment_1.default(repairDB.date).format('YYYY-MM-DD'),
            time: repairDB.time,
            userId: repairDB.user.id,
            repairState: repairDB.repairState
        };
        res.status(200).json({ repair });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getRepair = getRepair;
const addRepair = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Check if description, date and time are set
        const { description, date, time, userId } = req.body;
        if (!(description && date && time && userId)) {
            res.status(400).send({ message: 'description, date, time and user are required' });
            return;
        }
        const user = yield user_1.default.findById({ _id: userId });
        if (!user) {
            res.status(422).send({ message: 'user does not exist' });
            return;
        }
        const newRepairObj = {
            description,
            date: new Date(date),
            time,
            repairState: repair_1.RepairStates.Uncompleted,
            user: {
                id: user._id.toString(),
                fullName: user.fullName
            }
        };
        const newRepair = new repair_1.default(newRepairObj);
        yield newRepair.save();
        res.status(201).json({ message: 'Repair added' });
    }
    catch (error) {
        if (error.name === 'CastError') {
            res.status(422).send({ message: 'Userid incorrect' });
            return;
        }
        res.status(500).send(error);
    }
});
exports.addRepair = addRepair;
const updateRepair = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id }, body, } = req;
        const repairDB = yield repair_1.default.findById(id);
        if (!repairDB) {
            res.status(422).send({ message: 'Repair does not exist' });
            return;
        }
        const updatedRepair = {
            description: body.description,
            time: body.time,
            date: new Date(body.date),
            repairState: repair_1.RepairStates.Uncompleted,
            user: repairDB.user
        };
        if (body.userId !== repairDB.user.id) {
            const userDB = yield user_1.default.findById(body.userId);
            if (!userDB) {
                res.status(422).send({ message: 'user does exist' });
                return;
            }
            updatedRepair.user = {
                id: userDB._id.toString(),
                fullName: userDB.fullName
            };
        }
        yield repair_1.default.findByIdAndUpdate({ _id: id }, updatedRepair);
        res.status(200).json({ message: 'Repair updated' });
    }
    catch (error) {
        if (error.name === 'CastError') {
            res.status(422).send({ message: 'Repair incorrect' });
            return;
        }
        res.status(500).send(error);
    }
});
exports.updateRepair = updateRepair;
const markRepair = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id }, body, } = req;
        const repairDB = yield repair_1.default.findById(id);
        if (!repairDB) {
            res.status(422).send({ message: 'Repair does not exist' });
            return;
        }
        const { userId, repairState } = body;
        if (!userId || !repairState) {
            res.status(400).send({ message: 'User and mark are required' });
            return;
        }
        const userDB = yield user_1.default.findById(userId);
        if (!userDB) {
            res.status(422).send({ message: 'user does exist' });
            return;
        }
        if (repairDB.repairState !== repair_1.RepairStates.Uncompleted && userDB.role === user_1.Role.User) {
            res.status(422).send({ message: 'You can not undo the current mark' });
            return;
        }
        if (repairDB.user.id !== userId && userDB.role === user_1.Role.User) {
            res.status(422).send({ message: 'You do not have permissions to mark this repair' });
            return;
        }
        const updatedRepair = {
            repairState: repairState,
        };
        yield repair_1.default.findByIdAndUpdate({ _id: id }, updatedRepair);
        res.status(200).json({ message: 'Repair marked' });
    }
    catch (error) {
        if (error.name === 'CastError') {
            res.status(422).send({ message: 'Repair incorrect' });
            return;
        }
        res.status(500).send(error);
    }
});
exports.markRepair = markRepair;
const deleteRepair = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield repair_1.default.findByIdAndRemove(req.params.id);
        const repairs = yield repair_1.default.find();
        const transformedRepairs = (repairs || []).map((repair) => ({
            id: repair._id.toString(),
            description: repair.description,
            date: moment_1.default(repair.date).format('YYYY-MM-DD'),
            time: repair.time,
            repairState: repair.repairState
        }));
        res.status(200).json({ repairs: transformedRepairs });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.deleteRepair = deleteRepair;
const checkAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const time = req.query.time;
    const date = req.query.date;
    if (!time || !date) {
        res.status(422).send({ message: 'Date and time are required' });
        return;
    }
    const repairDB = yield repair_1.default.findOne({ date: new Date(date), time: parseInt(time) });
    res.status(200).json({ available: repairDB ? false : true });
});
exports.checkAvailability = checkAvailability;
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id } } = req;
        const repairDB = yield repair_1.default.findById({ _id: id });
        if (!repairDB) {
            res.status(401).send({ message: 'Repair does not exist' });
            return;
        }
        res.status(200).json({ comments: repairDB.comments });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getAllComments = getAllComments;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id }, body, } = req;
        const repairDB = yield repair_1.default.findById(id);
        if (!repairDB) {
            res.status(422).send({ message: 'Repair does not exist' });
            return;
        }
        yield repair_1.default.findByIdAndUpdate({ _id: id }, { $push: { comments: body.comment } });
        res.status(200).json({ message: 'Comment added' });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.addComment = addComment;
const getMark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id } } = req;
        const repairDB = yield repair_1.default.findById({ _id: id });
        if (!repairDB) {
            res.status(401).send({ message: 'Repair does not exist' });
            return;
        }
        const repair = {
            description: repairDB.description,
            repairState: repairDB.repairState
        };
        res.status(200).json({ repair });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getMark = getMark;
