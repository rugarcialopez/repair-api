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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
var Role;
(function (Role) {
    Role["Manager"] = "manager";
    Role["User"] = "user";
})(Role = exports.Role || (exports.Role = {}));
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Role,
        required: true
    }
}, { timestamps: true });
userSchema.statics.hashPassword = (plainPassword) => {
    return bcrypt.hashSync(plainPassword, 8);
};
userSchema.methods.checkIfPasswordIsValid = function (password) {
    return bcrypt.compareSync(password, this.get('password'));
};
const User = mongoose_1.model('User', userSchema, 'users');
exports.default = User;
