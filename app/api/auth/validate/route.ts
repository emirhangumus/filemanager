import { validateSessionToken } from "@/lib/db/auth";
import { r } from "@/lib/r";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.headers.get('X-FM-Session');

        const { session, user } = await validateSessionToken(sessionId ?? "");

        if (!session) {
            return r({ success: false, error: "Invalid session" }, 401);
        }

        if (!user) {
            return r({ success: false, error: "Invalid user" }, 401);
        }

        return r({
            success: true, data: {
                user,
            }
        }, 200);
    } catch (e) {
        // console.error(e);
        if (e instanceof SyntaxError) {
            return r({ success: false, error: "Invalid JSON" }, 400);
        }
        if (e instanceof Error) {
            return r({ success: false, error: e.message });
        }
        return r({ success: false, error: "An unknown error occurred" });
    }
}

