import zod from 'zod';

const UserCreden= zod.object({
    ownerName: zod.string().min(1),
    password: zod.string().min(6),
    email: zod.string().email(),
    phoneNo: zod.string().length(10),
    services: zod.array(zod.string()),
    description: zod.string(),
    otp: zod.string()
})

type UserCredenType= zod.infer<typeof UserCreden>;


const SigninDetails = zod.object({
    password: zod.string().min(6),
    email: zod.string().email(),
})

type SigninType = zod.infer<typeof SigninDetails>

const CustomeCredentials = zod.object({
    firstname: zod.string().min(1),
    lastname: zod.string().min(1),
    email: zod.string().email(),
    phoneNo: zod.string().length(10),
    dob: zod.string(),
    anniversery: zod.string(),
})

type CustomerType = zod.infer<typeof CustomeCredentials>;


export {UserCreden,UserCredenType, SigninType , CustomerType}