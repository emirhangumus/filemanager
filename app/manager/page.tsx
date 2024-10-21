import { AtomHydration } from "@/components/AtomHydration";
import { FileManager } from "@/components/FileManager";
import { CurrentUser } from "@/lib/atoms/currentUserAtom";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {

    try {

        const cookie = cookies().get("fm_session");

        if (!cookie) {
            redirect("/join");
        }
        const ret = await fetch("http://localhost:3000/api/auth/validate", {
            credentials: "include",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "X-FM-Session": cookie.value
            },
        });

        const data = await ret.json();

        if (!data.success) {
            redirect("/join");
        }

        const currentUser: CurrentUser = data.data.user;

        return (
            <AtomHydration user={currentUser}>
                <FileManager />
            </AtomHydration>
        );
    } catch (e) {
        console.error(e);
        redirect("/join");
    }

}
