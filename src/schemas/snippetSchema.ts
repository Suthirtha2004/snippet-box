import {z} from "zod";

const createSnippetSchema = z.object({
    title : z.string().min(1,"Title is required"),
    content : z.string().min(1,"Content is required"),
    language : z.string().optional(),
    isPublic : z.string().optional(),
})

const updateSnippetSchema = z.object({
    title : z.string().min(1,"Title is required").optional(),
    content : z.string().min(1,"Content is required").optional(),
    language : z.string().optional(),
    isPublic : z.string().optional(),
});