import z from "zod";

// zod schema for signup validation

const signupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
})


const loginSchema = z.object({
    email: z.string().email({message: "Invalid Email"}),
    password: z.string().min(6 ,{ message: "atleast 6 characters"})
})
export {signupSchema, loginSchema};