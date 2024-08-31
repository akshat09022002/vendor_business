"use strict";
// use .gitignore for critical files that can't be shared
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
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const schema_1 = require("./schema");
const nodemailer_1 = require("../middlewares/nodemailer");
const otp_1 = require("../routes/otp");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const JWT_SECRET = process.env.JWT_SECRET;
//    //    //   Session configuration
// app.use(session({
//   name: 'sessionId', // Name of the session ID cookie
//   secret: process.env.SESSION_SECRET || 'your-secret-key', // A secret key to sign the session ID cookie (use a strong, random string)
//   resave: false, // Prevents session from being saved back to the session store if it wasn't modified during the request
//   saveUninitialized: false, // Prevents uninitialized sessions from being saved to the session store
//   cookie: {
//     httpOnly: true, // Ensures the cookie is sent only via HTTP(S), not accessible via JavaScript
//     secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours (sets the expiration time of the cookie)
//     sameSite: 'lax' // Helps protect against CSRF attacks by only sending the cookie on same-site requests
//   }
// }));
// app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
const router = express_1.default.Router();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = yield req.body;
    const inputCheck = schema_1.UserSchema.safeParse(userDetails);
    if (!inputCheck.success) {
        return res.status(400).json({
            error: "Invalid Request",
        });
    }
    try {
        const userCheck = yield prisma.user.findFirst({
            where: {
                OR: [{ email: userDetails.email }, { phoneNo: userDetails.phoneNo }],
            },
        });
        if (!userCheck) {
            const emailOtp = (0, otp_1.generateOTP)();
            const phoneOtp = (0, otp_1.generateOTP)();
            const otpPresent = yield prisma.otp.findMany({
                where: {
                    email: userDetails.email,
                },
            });
            if (!otpPresent) {
                const createOtp = yield prisma.otp.create({
                    data: {
                        email: userDetails.email,
                        phoneNo: userDetails.phoneNo,
                        emailOtp: emailOtp,
                        phoneOtp: phoneOtp,
                        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                    },
                });
            }
            else {
                const updateOtp = yield prisma.otp.update({
                    where: {
                        email: userDetails.email,
                    },
                    data: {
                        emailOtp: emailOtp,
                        phoneOtp: phoneOtp,
                        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                    },
                });
            }
            const message = yield (0, nodemailer_1.sendOtpEmail)(userDetails.email, emailOtp);
            const saltRounds = 10;
            bcrypt_1.default.hash(userDetails.password, saltRounds, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                userDetails.password = hash;
                res.cookie("userTemp", userDetails, {
                    httpOnly: true,
                    secure: false, // To be set as true when in production
                    maxAge: 10 * 60 * 1000, // This cookie should be valid for 3 months,but changed to 5 min in development phase
                    sameSite: "lax",
                });
            }));
        }
        else {
            return res.status(403).json({
                error: "User Already Exists",
            });
        }
    }
    catch (_a) {
        return res.status(402).json({
            error: "Server Error",
        });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = yield req.body;
    const response = schema_1.UserSigninSchema.safeParse(userDetails);
    if (!response.success) {
        res.status(403).json({
            error: "Invalid Credentials",
        });
    }
    try {
        const user = yield prisma.user.findFirst({
            where: {
                email: userDetails.email,
            },
        });
        if (!user) {
            return res.status(401).json({
                error: "Invalid Email/Password",
            });
        }
        bcrypt_1.default.compare(userDetails.password, user.password, (err, result) => {
            if (err || result == false) {
                res.status(403).json({
                    error: "Invalid Email/Password",
                });
            }
            console.log("Jwt secret " + JWT_SECRET);
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // To be set as true when in production
                maxAge: 5 * 60 * 1000, // This cookie should be valid for 3 months,but changed to 5 min in development phase
                sameSite: "lax",
            });
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "Server Error",
        });
    }
}));
// router.post("/add-business", async (req, res) => {
//   const businessDetails: BusinessType = await req.body;
//   const userDetails:{
//     userId: string,
//     email: string,
//     phoneNo: string
//   } = req.user;
//   const response = BusinessSchema.safeParse(businessDetails);
//   if (!response.success) {
//     return res.status(403).json({
//       error: "Invalid Input Format",
//     });
//   }
//   const user= await prisma.business.create({});
// });
exports.userRoute = router;
//   //   // all every route check whether it session present
// if (req.session.user) {
//   res.send(`Welcome ${req.session.user.username}`);
// } else {
//   res.status(401).send('Please login first');
// }
// Example route to destroy session (logout)
// app.post('/logout', (req, res) => {
//   req.session.destroy(err => {
//     if (err) {
//       return res.status(500).send('Logout failed');
//     }
//     res.clearCookie('sessionId');
//     res.send('Logged out successfully');
//   });
// });
