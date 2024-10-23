import { checkRequestAuth } from "@/lib/db/auth/checkRequestAuth";
import { execCLI } from "@/lib/execCLI";
import { r } from "@/lib/r";
import { NextRequest } from "next/server";
import { actionSchemaMap, schema } from "../exec/schema";

export async function POST(request: NextRequest) {
    const [errorResponse, auth] = await checkRequestAuth(request);

    try {
        if (errorResponse) {
            return errorResponse;
        }

        if (!auth.user) {
            return r({ success: false, error: "Invalid user" });
        }

        const fd = await request.formData();

        const { type } = schema.parse({
            type: fd.get("type"),
            path: fd.get("path"),
        });

        const execResult = await execCLI(type, actionSchemaMap[type], {
            file: fd.get("file"),
            path: fd.get("path"),
        }, auth.user);

        return r({ success: true, data: execResult });

    } catch (e) {
        console.error(e);
        return r({ success: false, error: "Invalid input" });
    }
}

