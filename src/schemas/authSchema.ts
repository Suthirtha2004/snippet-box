import {email, z} from "zod";

const registerSchema = z.object({
    name : z.string().min(1,"Name is required"),
    email : z.string().email("Invalid email id"),
    password : z.string().min(8,"Password Must be more than 8 characters"),
});

const loginSchema = z.object({
    email : z.string().email("Invalid email"),
    password : z.string().min(8,"Password must be at least 8 characters"),
});


export {registerSchema,loginSchema};