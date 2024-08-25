import zod from 'zod';

const UserCreden= zod.object({
    ownerName: zod.string().min(1),
    password: zod.string().min(6),
    email: zod.string().email(),
    phoneNo: zod.string().length(10),
    services: zod.array(zod.string()),
    description: zod.string()
})

type UserCredenType= zod.infer<typeof UserCreden>;


export {UserCreden,UserCredenType}