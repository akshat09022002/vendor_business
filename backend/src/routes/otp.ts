import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import session from "express-session";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { OtpSchema, OtpType, UserType } from "./schema";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();

// OTP GENERATION
export const generateOTP = () => {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10); // Generates a random digit from 0 to 9
  }
  return otp;
};

router.get("/verify-otp", async (req, res) => {
  const userDetails: UserType = await req.cookies.userTemp;
  const otpEntry: OtpType = await req.body;

  try {
    const dbOtp = await prisma.otp.findFirst({
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

    if (
      otpEntry.emailOtp === dbOtp.emailOtp &&
      otpEntry.phoneOtp === dbOtp.phoneOtp
    ) {
      await prisma.user.create({
        data: {
          ownerName: userDetails.ownerName,
          password: userDetails.password,
          email: userDetails.email,
          phoneNo: userDetails.phoneNo,  
        },
      });

      await prisma.otp.delete({
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
  } catch (error) {
    return res.status(500).json({
      error: "Server Error"
    })
  }
});

export const otpRoute = router;
