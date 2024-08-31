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
exports.otpRoute = exports.generateOTP = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const router = express_1.default.Router();
// OTP GENERATION
const generateOTP = () => {
    let otp = "";
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10); // Generates a random digit from 0 to 9
    }
    return otp;
};
exports.generateOTP = generateOTP;
router.get("/verify-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = yield req.cookies.userTemp;
    const otpEntry = yield req.body;
    try {
        const dbOtp = yield prisma.otp.findFirst({
            where: {
                email: userDetails.email,
                phoneNo: userDetails.phoneNo,
            },
        });
        if (!dbOtp) {
            return res.status(400).json({
                error: "Bad Request",
            });
        }
        // check if otp expired
        // generate
        if (otpEntry.emailOtp === dbOtp.emailOtp &&
            otpEntry.phoneOtp === dbOtp.phoneOtp) {
            yield prisma.user.create({
                data: {
                    ownerName: userDetails.ownerName,
                    password: userDetails.password,
                    email: userDetails.email,
                    phoneNo: userDetails.phoneNo,
                },
            });
            yield prisma.otp.delete({
                where: {
                    id: userDetails.email,
                },
            });
            // jwt daalenge -->Ujjwal(see from login page)
            res.cookie("user", userDetails, {
                httpOnly: true,
                secure: false, // To be set as true when in production
                maxAge: 5 * 60 * 1000, // This cookie should be valid for 3 months,but changed to 5 min in development phase
                sameSite: "lax",
            });
            return res.json({
                message: "Otp Verification Complete",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            error: "Server Error"
        });
    }
}));
exports.otpRoute = router;
