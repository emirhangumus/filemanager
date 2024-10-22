import { AtomHydration } from "@/components/AtomHydration";
import { FileManager } from "@/components/FileManager";
import { CurrentUser } from "@/lib/atoms/currentUserAtom";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    const cookie = cookies().get("fm_session");

    if (!cookie) {
        redirect("/join");
    }

    // ik the hard-coded url is bad but I'm too lazy to fix it rn
    const ret = await fetch(`http://${process.env.NODE_ENV === 'production' ? 'filemanager_web' : 'localhost'}:3000/api/auth/validate`, {
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
        <AtomHydration user={currentUser} currentPath={`/home/${currentUser.username}`}>
            <FileManager />
        </AtomHydration>
    );
}
