"use strict";
// This page is only for routing
// create routes in route folder
// use .gitignore for critical files that can't be shared
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const otp_1 = require("./routes/otp");
const customer_1 = require("./routes/customer");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use('/api/v1/user', user_1.userRoute);
app.use('/api/v1/otp', otp_1.otpRoute);
app.use('/api/v1/customer', customer_1.customerRoute);
app.listen(PORT);
