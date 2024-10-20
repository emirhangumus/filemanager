import { CONTENT_LIST_COMMAND, DIRECTORY_LIST_COMMAND } from "@/lib/constants";
import { r } from "@/lib/r";
import type { DirectoryTree, LsLongFormat } from "@/lib/types";
import { spawn } from "child_process";
import { z } from "zod";

const schema = z.object({
    path: z.string(),
    type: z.enum(["content-list", "directory-list"]),
});

export const trimChars = (input: string, chars: string) => {
    let start = 0
    let end = input.length

    while (start < end && chars.includes(input[start])) {
        start += 1
    }

    while (end > start && chars.includes(input[end - 1])) {
        end -= 1
    }

    return start > 0 || end < input.length ? input.substring(start, end) : input
}

export async function POST(request: Request) {
    try {
        const { path, type } = schema.parse(await request.json());

        const child = spawn(type === 'content-list' ? CONTENT_LIST_COMMAND : DIRECTORY_LIST_COMMAND, { shell: true, cwd: path });
        let output = "";

        for await (const chunk of child.stdout) {
            output += chunk;
        }

        for await (const chunk of child.stderr) {
            output += chunk;
        }

        const files = output.split("\n").map((line) => {
            const [permissions, size, owner, month, time, ...n] = line.split(/\s+/);
            const name = trimChars(n.join(" "), "\'");
            if (!name) return;
            const fileType = permissions[0] === "d" ? "directory" : permissions[0] === "l" ? "link" : permissions[0] === "." ? "file" : "other";
            const permissionsObj = {
                user: {
                    read: permissions[1] === "r",
                    write: permissions[2] === "w",
                    execute: permissions[3] === "x",
                },
                group: {
                    read: permissions[4] === "r",
                    write: permissions[5] === "w",
                    execute: permissions[6] === "x",
                },
                other: {
                    read: permissions[7] === "r",
                    write: permissions[8] === "w",
                    execute: permissions[9] === "x",
                },
            };
            const lastModified = new Date(`${month} ${time}`);
            let extension = name.split(".").pop() || null;
            if (extension === name) {
                extension = null;
            }

            return {
                id: `${path}/${name}`,
                fileType,
                permissions: permissionsObj,
                owner,
                size: parseInt(size),
                lastModified,
                name,
                fileExtension: extension,
            } as LsLongFormat;
        }).filter((file) => !!file);


        if (type === 'directory-list') {
            const directories = files.filter((file) => file.fileType === 'directory');
            const directoryTree: DirectoryTree = {};
            directories.forEach((directory) => {
                const path = directory.id.split("/");
                let current = directoryTree;
                for (let i = 1; i < path.length; i++) {
                    if (!current[path[i]]) {
                        current[path[i]] = {};
                    }
                    current = current[path[i]];
                }
            });
            return r({ success: true, data: directoryTree });
        }


        return r({ success: true, data: files });
    } catch {
        return r({ success: false, error: "Invalid input" });
    }
}