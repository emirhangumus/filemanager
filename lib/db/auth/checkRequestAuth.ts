import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { r } from "@/lib/r";
import { NextRequest, NextResponse } from "next/server";
import { validateSessionToken } from ".";

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
type validateSessionToken = Awaited<ReturnType<typeof validateSessionToken>>;

export const checkRequestAuth = async (request: NextRequest): Promise<[NextResponse, null] | [null, validateSessionToken]> => {
    const sessionId = request.headers.get('X-FM-Session');
    const sessionIdCookie = request.cookies.get(SESSION_COOKIE_NAME);

    try {

        const { session, user } = await validateSessionToken(sessionId ?? sessionIdCookie?.value ?? "");

        if (!session) {
            return [r({ success: false, error: "Invalid session" }, 401), null,];
        }

        if (!user) {
            return [r({ success: false, error: "Invalid user" }, 401), null];
        }

        return [null, { session, user }];
    } catch (e) {
        // console.error(e);
        if (e instanceof SyntaxError) {
            return [r({ success: false, error: "Invalid JSON" }, 400), null];
        }
        if (e instanceof Error) {
            return [r({ success: false, error: e.message }), null];
        }
        return [r({ success: false, error: "An unknown error occurred" }), null];
    }
}