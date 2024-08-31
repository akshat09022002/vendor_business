import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request,Response,NextFunction, response } from "express";
import { string, ZodPipeline } from "zod";
import { pipeline } from "nodemailer/lib/xoauth2";

const prisma = new PrismaClient();


type userType={
    ownername: string,
    email: string,
    phoneno: string,
}

const JWT_SECRET = process.env.JWT_SECRET as string;

// Saare routes--> vendor entry

const verifyUserMiddleware = async (req:Request, res:Response, next:NextFunction) => {
  try {
    
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided." });
    }

    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    
    req.user= {
      email: user.email,
      name: user.ownerName,
      phoneNo: user.phoneNo,
    };

    
    next();
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token." });
  }
};

export default verifyUserMiddleware;
