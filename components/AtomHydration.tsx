"use client";

import { CurrentUser, currentUserAtom } from "@/lib/atoms/currentUserAtom";
import { useHydrateAtoms } from "jotai/utils";

type AtomHydrationProps = {
    children: React.ReactNode;
    // hydrationData?: Parameters<typeof useHydrateAtoms>[0];
    user: CurrentUser
};

export const AtomHydration = ({ children, user }: AtomHydrationProps) => {

    useHydrateAtoms([[currentUserAtom, user]]);

    return <>{children}</>;
}