import { CurrentUser } from "@/lib/atoms/currentUserAtom";
import { Session } from "@prisma/client";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import db from "..";

const SESSION_EXPIRY_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY || "defaultSecretKey"; // Use an environment variable for the secret key
const SALT_ROUNDS = 10;

// Helper to sign a value using HMAC with the SESSION_SECRET_KEY
function signSessionId(sessionId: string): string {
    return crypto
        .createHmac("sha256", SESSION_SECRET_KEY)
        .update(sessionId)
        .digest("hex");
}

// Verify the session ID signature
function verifySessionId(sessionId: string, signature: string): boolean {
    const expectedSignature = signSessionId(sessionId);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export async function createSession(userId: number): Promise<Session> {
    const bytes = crypto.randomBytes(20); // 160 bits
    const sessionId = encodeBase32LowerCaseNoPadding(bytes); // Generate base32-encoded session ID

    // Sign the session ID using the SESSION_SECRET_KEY
    const signedSessionId = signSessionId(sessionId);

    // Insert session into the database with signed sessionId
    const session = await db.session.create({
        data: {
            id: sessionId,
            signedId: signedSessionId, // Store the signed version
            userId,
            expiresAt: new Date(Date.now() + SESSION_EXPIRY_MS), // 30 days from now
        },
    });

    return session;
}

export async function validateSessionToken(sessionId: string): Promise<SessionValidationResult> {
    const sessionResult = await db.session.findUnique({
        where: {
            id: sessionId,
        },
    });

    if (!sessionResult) {
        return { session: null, user: null }; // Session not found
    }

    const session = sessionResult;

    // Verify the session ID signature
    if (!verifySessionId(sessionId, session.signedId)) {
        return { session: null, user: null }; // Session ID signature invalid
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
        await deleteSession(sessionId); // Delete expired session
        return { session: null, user: null }; // Session expired
    }


    // Get and validate user
    const userResult = await db.user.findUnique({
        where: {
            id: session.userId,
        },
        select: {
            id: true,
            username: true,
            email: true,
            Account: {
                take: 1,
                select: {
                    name: true,
                    lastName: true,
                    petName: true,
                },
            },
        }
    });

    if (!userResult) {
        return { session, user: null }; // User not found
    }

    const user = userResult;

    const currentUser: CurrentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        lastName: user.Account[0].lastName,
        name: user.Account[0].name,
        petName: user.Account[0].petName,
    };

    return { session, user: currentUser };
}

export async function deleteSession(sessionId: string): Promise<void> {
    await db.session.delete({
        where: {
            id: sessionId,
        },
    });
}

export function createPasswordHash(password: string): string {
    // Use bcrypt for password hashing with salt rounds
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
}

export function validatePassword(password: string, hash: string): boolean {
    // Validate the password using bcrypt
    return bcrypt.compareSync(password, hash);
}

function encodeBase32LowerCaseNoPadding(bytes: Uint8Array): string {
    const base32 = "abcdefghijklmnopqrstuvwxyz234567";
    let result = "";
    let bits = 0;
    let value = 0;
    for (let i = 0; i < bytes.length; i++) {
        value = (value << 8) | bytes[i];
        bits += 8;
        while (bits >= 5) {
            result += base32[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) {
        result += base32[(value << (5 - bits)) & 31];
    }
    return result;
}

type SessionValidationResult = {
    session: Session | null;
    user: CurrentUser | null;
};
