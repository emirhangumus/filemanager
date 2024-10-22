import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";

type R<T> = {
    success: true;
    data?: T
} | {
    success: false;
    error: string;
}

type Options = {
    setCookie?: {
        name: string;
        value: string;
        options: Partial<ResponseCookie>
    }[],
    removeCookie?: string[]
}

export const r = <T>(body: R<T>, statusCode: number = 200, options?: Options) => {
    const response = NextResponse.json(body, { status: statusCode });

    if (options?.setCookie) {
        for (const cookie of options.setCookie) {
            response.cookies.set(cookie.name, cookie.value, cookie.options);
        }
    }

    if (options?.removeCookie) {
        for (const cookie of options.removeCookie) {
            response.cookies.delete(cookie);
        }
    }

    return response;
}