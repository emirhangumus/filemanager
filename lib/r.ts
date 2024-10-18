import { NextResponse } from "next/server";

type R<T> = {
    success: true;
    data?: T
} | {
    success: false;
    error: string;
}

export const r = <T>(body: R<T>, statusCode: number = 200) => {
    return NextResponse.json(body, { status: statusCode });
}