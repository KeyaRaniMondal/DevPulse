import z from "zod";

export const createIssueSchema = z.object({
    title: z.string().max(150),
    description: z.string().min(20),
    type: z.enum(["bug", "feature_request"])
});

export const updateIssueSchema = z.object({
    title: z.string().max(150).optional(),
    description: z.string().min(20).optional(),
    type: z.enum(["bug", "feature_request"]).optional(),
    status: z
        .enum(["open", "in_progress", "resolved"])
        .optional()
});