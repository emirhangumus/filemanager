import { atom } from "jotai";
import { LsLongFormat } from "../types";

export const contentAtom = atom<{
    raw: LsLongFormat[];
    filteredContent: LsLongFormat[];
}>({
    raw: [],
    filteredContent: []
});