import z, { optional } from "zod";

const projectSchema = z.object({
    title: z.string(),
    description: z.string(),
    techStack: z.string().array(),
    requiredSkills: z.string().array(),
    teamSize: z.number(),
    deadline: z.string().optional()
})

const updateProject = z.object({
    title : z.string().optional(),
    description: z.string().optional(),
    techStack: z.string().array().optional(),
    requiredSkills: z.string().array().optional(),
    teamSize: z.number().optional(),
    deadline: z.string().optional()
})

export {projectSchema,updateProject}