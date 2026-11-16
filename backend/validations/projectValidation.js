import z, { optional } from "zod";

const projectSchema = z.object({
    title: z.string(),
    description: z.string(),
    tech: z.string(),
    roles: z.string(),
    teamSize: z.string(),
    category: z.string().optional()
})

const updateProject = z.object({
    title : z.string().optional(),
    description: z.string().optional(),
    tech: z.string().array().optional(),
    roles: z.string().array().optional(),
    teamSize: z.string().optional(),
})

export {projectSchema,updateProject}