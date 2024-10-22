import { currentUserAtom } from "@/lib/atoms/currentUserAtom";
import { useAtom } from "jotai";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const LogoutButton = () => {
    const [, setUser] = useAtom(currentUserAtom);
    const router = useRouter();

    const logout = async () => {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());

        if (!res.success) {
            toast.error(res.message);
            return;
        }

        setUser(null);
        router.push("/join");
        toast.success("Logout successful");
    }

    return (
        <Button onClick={logout}>
            <LogOutIcon size={24} />
            Logout
        </Button>
    );
}