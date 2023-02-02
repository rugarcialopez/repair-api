"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const uri = process.env.MONGOURI || 'mongodb://127.0.0.1:27017/repair-shop';
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose_1.default.set('useFindAndModify', false);
const PORT = process.env.PORT || 4000;
mongoose_1.default
    .connect(uri, options)
    .then(() => app_1.default.listen(PORT, () => console.log(`Server has started on port:${PORT}`)))
    .catch(error => {
    throw error;
});
