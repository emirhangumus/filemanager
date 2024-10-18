import { r } from "@/lib/r";
import { z } from "zod";
import fs from "fs";
import path from "path";

const schema = z.object({
    path: z.string(),
    type: z.enum(["create-dir", "delete-dir"]),
});

const actionSchemaMap = {
    "create-dir": z.object({
        name: z.string(),
    }),
    "delete-dir": z.object({
        name: z.string(),
    }),
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { path, type } = schema.parse(body);

        const commandShema = actionSchemaMap[type];

        if (!commandShema) {
            return r({ success: false, error: "Invalid input" });
        }

        let { name } = commandShema.parse(body);

        name = name.trim();

        switch (type) {
            case "create-dir":
                return await mkdir(path, name);
            case "delete-dir":
                return await deleteFolder(path, name);
        }

    } catch {
        return r({ success: false, error: "Invalid input" });
    }
}

const mkdir = async (p: string, name: string) => {
    try {
        fs.mkdirSync(path.join(p, name));
        return r({ success: true });
    } catch (e: unknown) {
        if (e instanceof Error && e.message.includes("EEXIST")) {
            return r({ success: false, error: "Folder already exists" });
        }
        return r({ success: false, error: "An error occurred" });
    }
}

const deleteFolder = async (p: string, name: string) => {
    try {
        fs.rmdirSync(path.join(p, name), { recursive: true });
        return r({ success: true });
    } catch {
        return r({ success: false, error: "An error occurred" });
    }
}
