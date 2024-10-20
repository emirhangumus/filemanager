import { atom } from "jotai";
import { LsLongFormat } from "../types";

type FileManagerState = {
    state: "idle" | "editing"
    loading: boolean
    ref: LsLongFormat | null
}

export const appStateAtom = atom<FileManagerState>({
    state: "idle",
    loading: false,
    ref: null,
});

export const editingFileAtom = atom<string | null>(null);