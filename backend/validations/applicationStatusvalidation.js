import z from "zod";

const applicationStatusSchema = z.object({
    
    status: z.enum(["pending", "accepted", "rejected"])
})

export default applicationStatusSchema