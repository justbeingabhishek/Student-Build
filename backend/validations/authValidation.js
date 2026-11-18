import z from "zod";

// zod schema for signup validation

console.log("hello");

const signupSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.email({message: "Invalid Email"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"})
})


const loginSchema = z.object({
    email: z.string().email({message: "Invalid Email"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"})
})
export {signupSchema, loginSchema};