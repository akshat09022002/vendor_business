// use .gitignore for critical files that can't be shared

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import session from "express-session";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { UserCredenType, UserCreden, SigninType } from "./schema";
import { sendOtpEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

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

const router = express.Router();

// OTP GENERATION
function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10); // Generates a random digit from 0 to 9
  }
  return otp;
}

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
      // Pointes to remember-:
      //1) check if an generated otp is already present for this user, if yes just update the previous one with new one.(Remember to update the validity of the new otp)
      //2) If no generated otp is present create a newEntry in database.
      //3) once an otp is verified make sure to clear it from database.
      //4) Always check if the otp is still valid(validity must be 5-10 mins)
      //5) Generate 2 OTP's one for phoneNo and other for email.

      const emailOtp = generateOTP();
      const phoneOtp = generateOTP();

      const otpPresent = await prisma.otp.findMany({
        where: {
          email: userDetails.email,
        },
      });

      if (!otpPresent) {
        const createOtp = await prisma.otp.create({
          data: {
            email: userDetails.email,
            phoneNo: userDetails.phoneNo,
            emailOtp: emailOtp,
            phoneOtp: phoneOtp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          },
        });
      } else {
        const updateOtp = await prisma.otp.update({
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

      const message = await sendOtpEmail(userDetails.email, emailOtp)

      // Set session
      // req.session.user = { userId };

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


router.post('/login', async (req, res) => {
  const details: SigninType = await req.body

  try {
    const response = await prisma.user.findFirst({
      where:{
        email: details.email
      }
    })

    if(!response){
      return res.json({
        error: "Invalid Credentials"
      })
    }

    if(response.password === details.password){
      res.cookie("userTemp", details, {
        httpOnly: true,
        secure: false, // To be set as true when in production
        maxAge: 5 * 60 * 1000, // This cookie should be valid for 3 months,but changed to 5 min in development phase
        sameSite: "lax",
      });
    }
    else {
      return res.json({
        error: "Invalid Credentials"
      })
    }

  } catch (error) {
    return res.status(402).json({
      error: "Server Error",
    });
  }
})



export const userRoute = router;


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
