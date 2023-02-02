"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import mongoose from "mongoose";
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const app = express_1.default();
app.use(cors_1.default());
app.use(helmet_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use('/api', routes_1.default);
exports.default = app;
