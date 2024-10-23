import { SESSION_COOKIE_NAME } from "@/lib/constants";
import db from "@/lib/db";
import { createPasswordHash, createSession } from "@/lib/db/auth";
import { r } from "@/lib/r";
import { spawn } from "child_process";
import type { NextRequest } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email(),
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
});

export async function POST(request: NextRequest) {
    try {
        const { confirmPassword, email, lastName, name, password, username } = registerSchema.parse(await request.json());

        if (password !== confirmPassword) {
            return r({ success: false, error: "Passwords do not match" });
        }

        if (await db.user.findFirst({ where: { email } })) {
            return r({ success: false, error: "Email already in use" });
        }

        if (await db.user.findFirst({ where: { username } })) {
            return r({ success: false, error: "Username already in use" });
        }

        const userId = await db.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    username,
                    password: createPasswordHash(password),
                },
            });

            await tx.account.create({
                data: {
                    name,
                    lastName,
                    userId: user.id,
                },
            });

            return user.id;
        })

        const err = await createUserForMachine(username);

        if (err) {
            return r({ success: false, error: "An error occurred while setting up the user" });
        }

        const session = await createSession(userId);

        return r({ success: true }, 201, {
            setCookie: [
                {
                    name: SESSION_COOKIE_NAME,
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

const createUserForMachine = async (username: string) => {
    const child = spawn("bash ./execCLI/userSetup.sh", {
        env: {
            ...process.env,
            FM_USERNAME: username,
        }
    });

    let output = "";

    for await (const chunk of child.stdout) {
        output += chunk;
    }

    for await (const chunk of child.stderr) {
        output += chunk;
    }

    let error = false;
    child.on("exit", (code) => {
        if (code !== 0) {
            console.error(`User setup failed with code ${code} | ${output}`);
            error = true;
        }
    });

    return error;
}