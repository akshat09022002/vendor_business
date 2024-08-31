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
exports.customerRoute = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const router = express_1.default.Router();
router.post("/register-customer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const details = yield req.body;
    try {
        const response = yield prisma.customer.findFirst({
            where: {
                phoneNo: details.phoneNo,
            },
        });
        if (response) {
            return res.status(403).json({
                error: "Customer Already Exist",
            });
        }
        const createCustomer = yield prisma.customer.create({
            data: {
                firstname: details.firstname,
                lastname: details.lastname,
                email: details.email,
                phoneNo: details.phoneNo,
                dob: details.dob,
                anniversery: details.anniversery,
            },
        });
        return res.json({
            message: "Customer Registration Successful",
        });
    }
    catch (error) {
        return res.status(402).json({
            error: "Server Error",
        });
    }
}));
exports.customerRoute = router;
