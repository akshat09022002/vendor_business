"use strict";

import express from 'express'
const session = require('express-session');
const cookieParser = require('cookie-parser');
import { sendOtpEmail } from '../nodemailer';

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

// Session configuration
app.use(session({
  name: 'sessionId', // Name of the session ID cookie
  secret: process.env.SESSION_SECRET || 'your-secret-key', // A secret key to sign the session ID cookie (use a strong, random string)
  resave: false, // Prevents session from being saved back to the session store if it wasn't modified during the request
  saveUninitialized: false, // Prevents uninitialized sessions from being saved to the session store
  cookie: {
    httpOnly: true, // Ensures the cookie is sent only via HTTP(S), not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
    maxAge: 24 * 60 * 60 * 1000, // 24 hours (sets the expiration time of the cookie)
    sameSite: 'lax' // Helps protect against CSRF attacks by only sending the cookie on same-site requests
  }
}));

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

const router = express.Router();

// OTP GENERATION
function generateOTP() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10); // Generates a random digit from 0 to 9
    }
    return otp;
}

router.post('/register', async(req, res) => {
    
    const otp = generateOTP();

    // otp added in the db

    const message = await sendOtpEmail(email, otp)

    // after the entry done in the database

    // Set session
    // req.session.user = { userId };
})


// all every route check whether it session present
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