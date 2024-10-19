import { atom } from "jotai";
import { ExecType, LsLongFormat } from "../types";

type DialogContext = {
    currentDialog: null | string | ExecType;
    ref: LsLongFormat | null;
}

export const dialogContextAtom = atom<DialogContext>({
    currentDialog: null,
    ref: null,
});