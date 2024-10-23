import { SESSION_COOKIE_NAME } from "@/lib/constants";
import db from "@/lib/db";
import { r } from "@/lib/r";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = req.cookies.get(SESSION_COOKIE_NAME);

        if (!session) {
            return r({ success: false, error: "Not logged in" }, 401);
        }

        await db.session.delete({ where: { id: session.value } });

        return r({ success: true }, 200, {
            removeCookie: [SESSION_COOKIE_NAME],
        });
    } catch (e) {
        console.error(e);
        if (e instanceof SyntaxError) {
            return r({ success: false, error: "Invalid JSON" }, 400);
        }
        if (e instanceof Error) {
            return r({ success: false, error: e.message });
        }
        return r({ success: false, error: "An unknown error occurred" });
    }
}

