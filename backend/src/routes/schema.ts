import zod from 'zod';

// Zod Schema for Business model
const BusinessSchema = zod.object({
    name: zod.string().min(1, "Business name is required"),
    userId: zod.string().uuid(),
    services: zod.array(zod.string()).min(1, "At least one service is required"),
    description: zod.string().min(1, "Description is required"),
  });

// Zod Schema for User model
const UserSchema = zod.object({
  ownerName: zod.string().min(1, "Owner name is required"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
  email: zod.string().email("Invalid email address"),
  phoneNo: zod.string().length(10, "Phone number must be 10 digits"),
  business: zod.array(BusinessSchema).optional(), // Assuming an array of Business IDs
});

// Zod Schema for user signin
const UserSigninSchema= zod.object({
    email: zod.string().min(1,"Invalid email address"),
    password: zod.string()
})

// Zod Schema for Otp model
const OtpSchema = zod.object({
  emailOtp: zod.string().length(6, "Email OTP is required"),
  phoneOtp: zod.string().length(6, "Phone OTP is required"),
});

// Zod Schema for Customer model
const CustomerSchema = zod.object({
  firstname: zod.string().min(1, "First name is required"),
  lastname: zod.string().optional(),
  email: zod.string().email("Invalid email address").optional(),
  phoneNo: zod.string().length(10, "Phone number must be 10 digits"),
  dob: zod.date(),
  anniversery: zod.date(),
  gender: zod.string()
});

// Types for each model
type UserType = zod.infer<typeof UserSchema>;
type BusinessType = zod.infer<typeof BusinessSchema>;
type OtpType = zod.infer<typeof OtpSchema>;
type CustomerType = zod.infer<typeof CustomerSchema>;
type UserSigninType = zod.infer<typeof UserSigninSchema>

// Export all schemas and types
export { 
  UserSchema, 
  BusinessSchema, 
  OtpSchema, 
  CustomerSchema,
  UserSigninSchema, 
  UserType, 
  BusinessType, 
  OtpType, 
  CustomerType,
  UserSigninType 
};
