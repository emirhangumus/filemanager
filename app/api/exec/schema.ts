import { z } from "zod";

const archiveFormatSchema = z.enum(["zip", "tar"]);
const typeSchema = z.enum(["create-dir", "delete-dir", "delete-file", "move", "copy", "cat-file", "write-file", "upload", "rename", "extract", "archive"]);
type ActionTypes = z.infer<typeof typeSchema>;

export const schema = z.object({
    path: z.string(),
    type: typeSchema,
});

export const actionSchemaMap: Record<ActionTypes, z.ZodObject<any, any>> = {
    "create-dir": z.object({
        path: z.string(),
        name: z.string(),
    }),
    "delete-dir": z.object({
        path: z.string(),
        name: z.string(),
    }),
    "delete-file": z.object({
        path: z.string(),
        name: z.string(),
    }),
    "move": z.object({
        from: z.string(),
        to: z.string(),
        items: z.array(z.string()),
        selectType: z.enum(["file", "directory"]),
    }),
    "copy": z.object({
        from: z.string(),
        to: z.string(),
        items: z.array(z.string()),
        selectType: z.enum(["file", "directory"]),
    }),
    "cat-file": z.object({
        items: z.array(z.string()),
    }),
    "write-file": z.object({
        path: z.string(),
        content: z.string().optional(),
    }),
    "upload": z.object({
        path: z.string(),
        file: z.any(),
    }),
    "rename": z.object({
        name: z.string(),
        path: z.string(),
    }),
    "extract": z.object({
        target: z.string(),
        source: z.string(),
        extractType: archiveFormatSchema,
    }),
    "archive": z.object({
        path: z.string(),
        name: z.string(),
        items: z.array(z.string()),
        format: archiveFormatSchema,
    }),
}