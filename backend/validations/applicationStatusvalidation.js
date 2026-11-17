import z, { email } from "zod";

const applicationStatusSchema = z.object({
    email : z.email(),
    role : z.string(),
    owner : z.string(),
    link : z.string(),
    reason : z.string().min(10,"Must containe atleast 10 characters"),
    project :  z.string(),
})

export default applicationStatusSchema