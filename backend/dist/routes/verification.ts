"use strict";

import express from 'express'
import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()

const app = express();
app.use(express.json());

const router = express.Router();

router.get('/verify', async(req, res) => {
    const {email, otp} = req.body()

    const dbOtp = await prisma.otp.findFirst({
        where: {
            email: email
        },
    })

    if(otp === dbOtp?.emailOtp){
        // add data to the db
    }
})

