import { checkRequestAuth } from "@/lib/db/auth/checkRequestAuth";
import { r } from "@/lib/r";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const [errorResponse, auth] = await checkRequestAuth(request);

    if (errorResponse) {
        return errorResponse;
    }

    return r({
        success: true, data: {
            user: auth.user,
        }
    }, 200);
}
