import express from "express";
import cookieParser from 'cookie-parser'
import { PrismaClient } from "@prisma/client";
import { CustomerType } from "./schema";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();

router.post('/register-customer', async (req, res) => {
    const details: CustomerType = await req.body;

    try {
        const response = await prisma.customer.findFirst({
            where:{
                phoneNo: details.phoneNo
            }
        })

        if(response) {
            return res.status(403).json({
                error: "Customer Already Exist"
            });
        }

        const createCustomer = await prisma.customer.create({
            data:{
                firstname: details.firstname,
                lastname: details.lastname,
                email: details.email,
                phoneNo : details.phoneNo,
                dob: details.dob,
                anniversery: details.anniversery
            }
        })

        return res.json({
            message: 'Customer Registration Successful'
        })

    } catch (error) {
        return res.status(402).json({
            error: "Server Error",
        });
    }
})

export const customerRoute = router;