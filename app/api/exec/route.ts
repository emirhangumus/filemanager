import { execCLI } from "@/lib/execCLI";
import { r } from "@/lib/r";
import { actionSchemaMap, schema } from "./schema";

/**
 * TODOs:
 * - Add error handling
 * - Add logging
 * - Add tests
 * - Add security for file operations (e.g. check if the user has the right permissions - User can not delete other user's files)
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type } = schema.parse(body);

        const execResult = await execCLI(type, actionSchemaMap[type], body);

        return r({ success: true, data: execResult });

    } catch (e) {
        console.error(e);
        return r({ success: false, error: "Invalid input" });
    }
}

