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
exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtpout.secureserver.net',
    secure: true,
    tls: {
        ciphers: 'SSLv3'
    },
    requireTLS: true, // Forces the connection to use TLS, even if the server advertises that it can accept non-encrypted connections. ensures that your emails are transmitted securely
    port: 465,
    debug: true, // Enables detailed logging of the SMTP communication between your server and the SMTP server.
    auth: {
        user: process.env.SECRET_EMAIL,
        pass: process.env.SECRET_PASSWORD,
    },
});
const sendOtpEmail = (to, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: "services@turl.co.in",
            to: to,
            subject: 'Please verify you email.',
            html: `<p>Your OTP is <strong>${otp}</strong></p>. This otp is only valid for 10 mins.`,
        });
        return "OTP sent successfully";
    }
    catch (error) {
        return "Something went wrong";
    }
});
exports.sendOtpEmail = sendOtpEmail;
// DOUBT 
// TUMKO YEH SAARE OPTION PATA KESE CHALE ??
// SSLv3  // iske alawa bhi or they
