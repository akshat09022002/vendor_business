import express from "express";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { CustomerType } from "./schema";
import { sendPromotionEmail } from "../middlewares/nodemailer";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();

router.post("/register-customer", async (req, res) => {
  const details: CustomerType = await req.body;

  try {
    const response = await prisma.customer.findFirst({
      where: {
        phoneNo: details.phoneNo,
      },
    });

    if (response) {
      return res.status(403).json({
        error: "Customer Already Exist",
      });
    }

    await prisma.customer.create({
      data: {
        firstname: details.firstname,
        lastname: details.lastname,
        email: details.email,
        phoneNo: details.phoneNo,
        dob: details.dob,
        anniversery: details.anniversery,
        gender: details.gender
      },
    });

    return res.json({
      message: "Customer Registration Successful",
    });
  } catch (error) {
    return res.status(402).json({
      error: "Server Error",
    });
  }
});

interface PromotionDetails {
  customerId: string,
  message: string
}

router.post('/promotion', async (req, res) => {
  try {
    const details: PromotionDetails[] = req.body;

    if (!Array.isArray(details) || details.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty promotion details' });
    }

    const emailPromises = details.map((mail) => sendPromotionEmail(mail.customerId, mail.message));
    
    // Wait for all emails to be sent
    await Promise.all(emailPromises);
    
    return res.status(200).json({ 
      message: 'Promotions sent successfully'
     });

  } catch (error) {
    console.error('Error processing promotion emails:', error);
    return res.status(500).json({ 
      error: 'Something went wrong while sending promotions'
    });
  }
});

export const customerRoute = router;
