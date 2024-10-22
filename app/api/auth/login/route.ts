import db from "@/lib/db";
import { createSession, validatePassword } from "@/lib/db/auth";
import { r } from "@/lib/r";
import type { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
    emailOrUsername: z.string(),
    password: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        const { emailOrUsername, password } = loginSchema.parse(await request.json());

        const user = await db.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername },
                ],
            },
        });

        if (!user) {
            return r({ success: false, error: "User not found" }, 404);
        }

        if (!validatePassword(password, user.password)) {
            return r({ success: false, error: "Invalid password" });
        }

        const session = await createSession(user.id);

        return r({ success: true }, 201, {
            setCookie: [
                {
                    name: "fm_session",
                    value: session.id,
                    options: {
                        httpOnly: true,
                        sameSite: "lax",
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 60 * 60 * 24 * 7,
                    },
                },
            ],
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

