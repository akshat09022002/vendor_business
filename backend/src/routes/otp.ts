import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import session from 'express-session';
import cookieParser from 'cookie-parser'
import { PrismaClient } from "@prisma/client";
import { UserCredenType, UserCreden } from "./schema";


const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();

router.get('/verify-otp',async(req,res)=>{
    const userDetails: UserCredenType = await req.body()
  
    try {
      const dbOtp = await prisma.otp.findFirst({
        where: {
            email: userDetails.email
        },
      })
  
      if(userDetails.otp === dbOtp?.emailOtp){
          const user = await prisma.user.create({
            data:{
                ownerName: userDetails.ownerName,
                password: userDetails.password,
                email: userDetails.email,
                phoneNo: userDetails.phoneNo,
                services: userDetails.services,
                description: userDetails.description
            }
          })

          const deleteOtp = await prisma.otp.delete({
            where:{
                id: userDetails.email
            }
          })

          res.cookie("userTemp", userDetails, {
            httpOnly: true,
            secure: false, // To be set as true when in production
            maxAge: 5 * 60 * 1000, // This cookie should be valid for 3 months,but changed to 5 min in development phase
            sameSite: "lax",
          });

          return res.json({
            message: "Otp Verification Complete"
          })
      }
    } catch (error) {
      console.error("Error in Verifying Otp: ", error)
    }
  
});

export const otpRoute = router;