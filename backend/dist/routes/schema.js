"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSigninSchema = exports.CustomerSchema = exports.OtpSchema = exports.BusinessSchema = exports.UserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// Zod Schema for Business model
const BusinessSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Business name is required"),
    userId: zod_1.default.string().uuid(),
    services: zod_1.default.array(zod_1.default.string()).min(1, "At least one service is required"),
    description: zod_1.default.string().min(1, "Description is required"),
});
exports.BusinessSchema = BusinessSchema;
// Zod Schema for User model
const UserSchema = zod_1.default.object({
    ownerName: zod_1.default.string().min(1, "Owner name is required"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long"),
    email: zod_1.default.string().email("Invalid email address"),
    phoneNo: zod_1.default.string().length(10, "Phone number must be 10 digits"),
    business: zod_1.default.array(BusinessSchema).optional(), // Assuming an array of Business IDs
});
exports.UserSchema = UserSchema;
// Zod Schema for user signin
const UserSigninSchema = zod_1.default.object({
    email: zod_1.default.string().min(1, "Invalid email address"),
    password: zod_1.default.string()
});
exports.UserSigninSchema = UserSigninSchema;
// Zod Schema for Otp model
const OtpSchema = zod_1.default.object({
    emailOtp: zod_1.default.string().length(6, "Email OTP is required"),
    phoneOtp: zod_1.default.string().length(6, "Phone OTP is required"),
});
exports.OtpSchema = OtpSchema;
// Zod Schema for Customer model
const CustomerSchema = zod_1.default.object({
    firstname: zod_1.default.string().min(1, "First name is required"),
    lastname: zod_1.default.string().optional(),
    email: zod_1.default.string().email("Invalid email address").optional(),
    phoneNo: zod_1.default.string().length(10, "Phone number must be 10 digits"),
    dob: zod_1.default.date(),
    anniversery: zod_1.default.date(),
});
exports.CustomerSchema = CustomerSchema;
