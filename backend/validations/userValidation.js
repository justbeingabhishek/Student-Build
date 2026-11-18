import z from 'zod'

const updateProfileSchema = z.object({
    name: z.string().optional(),
    college:z.string().optional(),
    year:z.number().optional(),
    bio: z.string().optional(),
    skills: z.string().array().optional(),
    github:z.union([z.url(), z.literal("")]).optional(),
    portfolio:z.string().optional()
})

export default updateProfileSchema