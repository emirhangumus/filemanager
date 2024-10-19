import { r } from "@/lib/r";
import fs from "fs";
import path from "path";
import { z } from "zod";

/**
 * TODOs:
 * - Add error handling
 * - Add logging
 * - Add tests
 * - Add security for file operations (e.g. check if the user has the right permissions - User can not delete other user's files)
 */

const schema = z.object({
    path: z.string(),
    type: z.enum(["create-dir", "delete-dir", "delete-file", "move", "copy"])
});

const actionSchemaMap = {
    "create-dir": z.object({
        name: z.string(),
    }),
    "delete-dir": z.object({
        name: z.string(),
    }),
    "delete-file": z.object({
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
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { path, type } = schema.parse(body);

        switch (type) {
            case "create-dir":
                return await mkdir(actionSchemaMap[type], body, path);
            case "delete-dir":
                return await deleteFolder(actionSchemaMap[type], body, path);
            case "delete-file":
                return await deleteFile(actionSchemaMap[type], body, path);
            case "copy":
                return await copy(actionSchemaMap[type], body);
            case "move":
                return await move(actionSchemaMap[type], body);
        }

    } catch {
        return r({ success: false, error: "Invalid input" });
    }
}

const mkdir = async (commandShema: typeof actionSchemaMap['create-dir'], body: any, p: string) => {
    try {

        let { name } = commandShema.parse(body);
        name = name.trim();

        fs.mkdirSync(path.join(p, name));
        return r({ success: true });
    } catch (e: unknown) {
        if (e instanceof Error && e.message.includes("EEXIST")) {
            return r({ success: false, error: "Folder already exists" });
        }
        return r({ success: false, error: "An error occurred" });
    }
}

const deleteFolder = async (commandShema: typeof actionSchemaMap['delete-dir'], body: any, p: string) => {
    try {
        let { name } = commandShema.parse(body);
        name = name.trim();

        fs.rmdirSync(path.join(p, name), { recursive: true });
        return r({ success: true });
    } catch {
        return r({ success: false, error: "An error occurred" });
    }
}

const deleteFile = async (commandShema: typeof actionSchemaMap['delete-file'], body: any, p: string) => {
    try {
        let { name } = commandShema.parse(body);
        name = name.trim();

        fs.unlinkSync(path.join(p, name));
        return r({ success: true });
    } catch {
        return r({ success: false, error: "An error occurred" });
    }
}

const copy = async (commandShema: typeof actionSchemaMap['copy'], body: any) => {
    try {
        let { to, items, selectType } = commandShema.parse(body);
        to = to.trim();

        items.forEach((item: string) => {
            if (selectType === "directory") {
                fs.cpSync(item, path.join(to, path.basename(item)), { recursive: true });
            } else {
                fs.copyFileSync(item, path.join(to, path.basename(item)));
            }
        });
        return r({ success: true });
    } catch (e) {
        console.log(e);

        return r({ success: false, error: "An error occurred" });
    }
}

const move = async (commandShema: typeof actionSchemaMap['move'], body: any) => {
    try {
        let { to, items, selectType } = commandShema.parse(body);
        to = to.trim();

        items.forEach((item: string) => {
            if (selectType === "directory") {
                fs.renameSync(item, path.join(to, path.basename(item)));
            } else {
                fs.renameSync(item, path.join(to, path.basename(item)));
            }
        });
        return r({ success: true });
    } catch {
        return r({ success: false, error: "An error occurred" });
    }
}
