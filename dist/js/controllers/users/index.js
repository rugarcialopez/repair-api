"use strict";
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
exports.deleteUser = exports.updateUser = exports.addUser = exports.getUser = exports.getUsers = void 0;
const user_1 = __importDefault(require("../../models/user"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Get the user ID from previous midleware
        const userId = res.locals.jwtPayload.userId;
        const role = req.query.role;
        const filter = role ? { _id: { $ne: userId }, role: role } : { _id: { $ne: userId } };
        const users = yield user_1.default.find(filter);
        const transformedUsers = (users || []).map((user) => ({
            id: user._id.toString(),
            fullName: user.fullName,
            role: user.role,
        }));
        res.status(200).json({ users: transformedUsers });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id } } = req;
        const userDB = yield user_1.default.findById({ _id: id });
        if (!userDB) {
            res.status(401).send({ message: 'User does not exist' });
            return;
        }
        const user = {
            id,
            fullName: userDB.fullName,
            email: userDB.email,
            role: userDB.role
        };
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getUser = getUser;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        //Check if fullName, email, password and role are set
        const { fullName, email, password, role } = req.body;
        if (!(fullName && email && password && role)) {
            res.status(400).send({ message: 'fullName, email, password and role are required' });
            return;
        }
        const userDB = yield user_1.default.findOne({ email: email.toLowerCase() });
        if (userDB) {
            res.status(401).send({ message: 'User already exists' });
            return;
        }
        const user = new user_1.default({
            fullName: body.fullName,
            email: body.email.toLowerCase(),
            password: user_1.default.hashPassword(body.password),
            role: body.role
        });
        yield user.save();
        res.status(201).json({ message: 'User added' });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.addUser = addUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id }, body, } = req;
        yield user_1.default.findByIdAndUpdate({ _id: id }, body);
        res.status(200).json({ message: 'User updated' });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.jwtPayload.userId;
    try {
        yield user_1.default.findByIdAndRemove(req.params.id);
        const users = yield user_1.default.find({ _id: { $ne: userId } });
        const transformedUsers = (users || []).map((user) => ({
            id: user._id.toString(),
            fullName: user.fullName,
            role: user.role,
        }));
        res.status(200).json({ users: transformedUsers });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.deleteUser = deleteUser;
