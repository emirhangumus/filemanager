import { actionSchemaMap } from "@/app/api/exec/schema";
import { spawn } from "child_process";
import fs from "fs";
import _path from "path";
import { Readable } from 'stream'; // Import Readable stream for buffer wrapping
import { CurrentUser } from "./atoms/currentUserAtom";

export const execCLI = async (type: keyof typeof actionSchemaMap, validation: typeof actionSchemaMap[keyof typeof actionSchemaMap], data: any, user: CurrentUser) => {

    let file: string | undefined = undefined;
    let env: { [key: string]: string } = {};
    let fileObj: File | undefined = undefined;

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
            FM_CONTENT: content ?? "",
            FM_PATH: path,
        }
    } else if (type === 'upload') {
        const { file: f, path } = validation.parse(data);
        file = "upload";
        env = {
            FM_CONTENT: f,
            FM_PATH: path,
            FM_TMPSTR: f.name,
        }
        fileObj = f;
    } else if (type === 'cat-file') {
        const { items } = validation.parse(data);
        file = "cat";
        env = {
            FM_ITEMS: JSON.stringify(items),
        }
    } else if (type === 'rename') {
        const { name, path } = validation.parse(data);
        file = "rename";
        env = {
            FM_NAME: name,
            FM_PATH: path,
        }
    } else if (type === 'extract') {
        const { target, source, extractType } = validation.parse(data);
        file = "extract";
        env = {
            FM_TARGET: target,
            FM_SOURCE: source,
            FM_EXTRACT_TYPE: extractType,
        }
    } else if (type === 'archive') {
        const { name, items, format, path } = validation.parse(data);
        file = "archive";
        env = {
            FM_PATH: path,
            FM_NAME: name,
            FM_ITEMS: JSON.stringify(items),
            FM_FORMAT: format,
        }
    }
    else {
        throw new Error("Invalid type");
    }

    if (!file) {
        throw new Error("Invalid type");
    }

    // const username = user.username; // TODO: Get the username from the database
    const cmd = `su -s /bin/bash -c 'node ./execCLI/${file}.js' ${user.username}`;

    console.log("Executing command...", cmd);
    console.log("Env...", env);

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

    if (output.trim() === SIG_FM_CREATED.code) {
        return SIG_FM_CREATED.fn({ env, fileObj });
    } else {
        return output;
    }
}

const saveFile = (fileStream: NodeJS.ReadableStream, writeStream: fs.WriteStream) => {
    fileStream.pipe(writeStream);

    writeStream.on('finish', () => {
        console.log('File saved successfully!');
    });

    writeStream.on('error', (err) => {
        console.error('Error saving file:', err);
    });
};

type T_SIG_FM_CREATED_FN = {
    env: { [key: string]: string };
    fileObj: File | undefined;
}

const SIG_FM_CREATED = {
    code: "FM:CREATED",
    fn: ({ env, fileObj }: T_SIG_FM_CREATED_FN) => {
        // override to that created file
        const path = env['FM_PATH'];
        if (!path) {
            throw new Error("Path not found");
        }
        if (!fileObj) {
            throw new Error("File not found");
        }
        const fullPath = _path.join(path, fileObj.name);

        if (fs.existsSync(fullPath) && fileObj) {
            const writeStream = fs.createWriteStream(fullPath);
            const readableStream = fileObj.stream();
            const r = readableStream.getReader();
            r.read().then((res) => {
                if (res.done) {
                    return;
                }
                saveFile(new Readable({
                    read() {
                        this.push(res.value);
                        this.push(null);
                    }
                }), writeStream);
            }, (err) => {
                console.error("Error reading file -> ", err);
            });
            return "File created";
        } else {
            console.error("File not found -> ", fullPath);
            return "File not found";
        }
    }

}
