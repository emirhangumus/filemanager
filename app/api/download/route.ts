import { validateSessionToken } from "@/lib/db/auth";
import { r } from "@/lib/r";
import { getContentType } from "@/lib/utils";
import { readFile } from "fs/promises";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {

        const fm_session = req.cookies.get("fm_session");

        if (!fm_session) {
            return r({ success: false, error: "You are not logged in" }, 401);
        }

        const { user, session } = await validateSessionToken(fm_session.value);

        if (!user || !session) {
            return r({ success: false, error: "You are not logged in" }, 401);
        }

        const searchParams = req.nextUrl.searchParams
        const { path } = searchParams.get("path") ? { path: searchParams.get("path") } : { path: "" };

        if (!path) {
            return r({ success: false, error: "Invalid input" }, 400);
        }

        // path have to start with /home/username
        if (!path.startsWith(`/home/${user.username}`)) {
            return r({ success: false, error: "You are not allowed to access this file" }, 403);
        }

        const buffer = await readFile(path);

        // set the headers to tell the browser to download the file
        const headers = new Headers();

        const filename = path.split("/").pop();

        if (!filename) {
            return r({ success: false, error: "Invalid input" }, 400);
        }

        const contentType = getContentType(filename.split(".").pop());

        headers.append("Content-Disposition", 'attachment; filename="' + filename + '"');
        headers.append("Content-Type", contentType);

        return new Response(buffer, {
            headers,
        });
    } catch (e) {
        console.error(e);
        return r({ success: false, error: "Invalid input" }, 400);
    }
}

