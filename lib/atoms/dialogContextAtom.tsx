import { atom } from "jotai";
import { LsLongFormat } from "../types";

type DialogContext = {
    currentDialog: null | string;
    ref: LsLongFormat | null;
}

export const dialogContextAtom = atom<DialogContext>({
    currentDialog: null,
    ref: null,
});