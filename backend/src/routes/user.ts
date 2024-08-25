// use .gitignore for critical files that can't be shared

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { UserCredenType, UserCreden } from "./schema";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();

router.post("/register", async (req, res) => {
  const userDetails: UserCredenType = await req.body;

  const inputCheck = UserCreden.safeParse(userDetails);
  if (!inputCheck.success) {
    return res.status(400).json({
      error: "Invalid Request",
    });
  }

  try {
    const userCheck = await prisma.user.findFirst({
      where: {
        OR: [{ email: userDetails.email }, { phoneNo: userDetails.phoneNo }],
      },
    });

    if (!userCheck) {
      // To increase security this could be hased using bcrypt or verified using JWT for now I don't think this is required.

      // Add Otp Logic(make this in a seperate otp.js file just use imported functions here)
      //Pointes to remember-:
      //1) check if an generated otp is already present for this user, if yes just update the previous one with new one.(Remember to update the validity of the new otp)
      //2) If no generated otp is present create a newEntry in database.
      //3) once an otp is verified make sure to clear it from database.
      //4) Always check if the otp is still valid(validity must be 5-10 mins)
      //5) Generate 2 OTP's one for phoneNo and other for email.

      res.cookie("userTemp", userDetails, {
        httpOnly: true,
        secure: false, // To be set as true when in production
        maxAge: 5 * 60 * 1000, // This cookie should be valid for 3 months,but changed to 5 min in development phase
        sameSite: "lax",
      });
    } else {
      return res.status(403).json({
        error: "User Already Exists",
      });
    }
  } catch {
    return res.status(402).json({
      error: "Server Error",
    });
  }
});

router.get('verify-otp',async(req,res)=>{
    
});

export const userRoute = router;
