import { atom } from "jotai";

type PathAtom = {
    pathStack: string[];
    currentPath: string;
    invalidate: boolean;
    loading: boolean;
}

export const pathAtom = atom<PathAtom>({
    pathStack: [],
    currentPath: "",
    invalidate: true,
    loading: true,
});