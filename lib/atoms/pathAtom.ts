import { atom } from "jotai";

type PathAtom = {
    pathStack: string[];
    currentPath: string;
    invalidate: boolean;
    loading: boolean;
}

export const pathAtom = atom<PathAtom>({
    pathStack: [],
    currentPath: "/home/emirhan/Workspace/web/filemanager",
    invalidate: true,
    loading: true,
});