import { r } from "@/lib/r";
import { spawn } from "child_process";
import { z } from "zod";

/**
 * TODOs:
 * - Add error handling
 * - Add logging
 * - Add tests
 * - Add security for file operations (e.g. check if the user has the right permissions - User can not delete other user's files)
 */

const typeSchema = z.enum(["create-dir", "delete-dir", "delete-file", "move", "copy", "cat-file", "write-file"]);
type ActionTypes = z.infer<typeof typeSchema>;

const schema = z.object({
    path: z.string(),
    type: typeSchema,
});

const actionSchemaMap: Record<ActionTypes, z.ZodObject<any, any>> = {
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
        content: z.string(),
    }),
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type } = schema.parse(body);

        const execResult = await execCLI(type, actionSchemaMap[type], body);
        console.log("execResult -> ", execResult);

        return r({ success: true, data: execResult });

    } catch (e) {
        console.error(e);
        return r({ success: false, error: "Invalid input" });
    }
}

const execCLI = async (type: keyof typeof actionSchemaMap, validation: typeof actionSchemaMap[keyof typeof actionSchemaMap], data: any) => {

    let file: string | undefined = undefined;
    let env = {};

    if (type === 'create-dir') {
        const { name, path } = validation.parse(data);
        file = "mkdir";
        env = {
            FM_NAME: name,
            FM_PATH: path,
        }
    } else if (type === 'delete-dir') {
        const { name, path } = validation.parse(data);
        file = "rmdir";
        env = {
            FM_NAME: name,
            FM_PATH: path,
        }
    } else if (type === 'delete-file') {
        const { name, path } = validation.parse(data);
        file = "rm";
        env = {
            FM_NAME: name,
            FM_PATH: path,
        }
    } else if (type === 'copy') {
        const { from, to, items, selectType } = validation.parse(data);
        file = "cp";
        env = {
            FM_FROM: from,
            FM_TO: to,
            FM_ITEMS: JSON.stringify(items),
            FM_SELECT_TYPE: selectType,
        }
    } else if (type === 'move') {
        const { from, to, items, selectType } = validation.parse(data);
        file = "mv";
        env = {
            FM_FROM: from,
            FM_TO: to,
            FM_ITEMS: JSON.stringify(items),
            FM_SELECT_TYPE: selectType,
        }
    } else if (type === 'write-file') {
        const { content, path } = validation.parse(data);
        file = "write";
        env = {
            FM_CONTENT: content,
            FM_PATH: path,
        }
    } else if (type === 'cat-file') {
        const { items } = validation.parse(data);
        file = "cat";
        env = {
            FM_ITEMS: JSON.stringify(items),
        }
    } else {
        throw new Error("Invalid type");
    }

    if (!file) {
        throw new Error("Invalid type");
    }

    const username = "emirhan"; // TODO: Get the username from the database
    const cmd = `su -s /bin/bash -c 'node ./execCLI/${file}.js' ${username}`;

    console.log("Executing command...", cmd);

    const child = spawn(cmd, {
        shell: true,
        env: {
            ...process.env,
            ...env,
        }
    });

    let output = "";

    for await (const chunk of child.stdout) {
        output += chunk;
    }

    for await (const chunk of child.stderr) {
        output += chunk;
    }

    return output;
}