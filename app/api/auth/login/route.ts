import { r } from "@/lib/r";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log(body);

        return r({ success: true });
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

