import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
    db = new PrismaClient();
} else {
    if (!(global as any).db) {
        (global as any).db = new PrismaClient();
    }
    db = (global as any).db;
}

export default db;