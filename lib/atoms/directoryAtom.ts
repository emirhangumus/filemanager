import { atom } from "jotai";
import { DirectoryTree } from "../types";

type DirectoryAtom = {
    directories: DirectoryTree | null;
    openDirectories: string[];
    loading: boolean;
    invalidate: boolean;
};

export const directoryAtom = atom<DirectoryAtom>({
    directories: null,
    openDirectories: [],
    loading: true,
    invalidate: true,
});