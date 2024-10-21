import { execCLI } from "@/lib/execCLI";
import { r } from "@/lib/r";
import { actionSchemaMap, schema } from "../exec/schema";

export async function POST(request: Request) {
    try {
        const fd = await request.formData();

        const { type } = schema.parse({
            type: fd.get("type"),
            path: fd.get("path"),
        });

        const execResult = await execCLI(type, actionSchemaMap[type], {
            file: fd.get("file"),
            path: fd.get("path"),
        });

        return r({ success: true, data: execResult });

    } catch (e) {
        console.error(e);
        return r({ success: false, error: "Invalid input" });
    }
}

