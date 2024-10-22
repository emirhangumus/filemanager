"use client";

import { CurrentUser, currentUserAtom } from "@/lib/atoms/currentUserAtom";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { useHydrateAtoms } from "jotai/utils";

type AtomHydrationProps = {
    children: React.ReactNode;
    // hydrationData?: Parameters<typeof useHydrateAtoms>[0];
    user: CurrentUser
    currentPath: string;
};

export const AtomHydration = ({ children, user, currentPath }: AtomHydrationProps) => {

    useHydrateAtoms([[currentUserAtom, user], [pathAtom, {
        pathStack: [],
        currentPath: currentPath,
        invalidate: true,
        loading: true,
    }]]);

    return <>{children}</>;
}