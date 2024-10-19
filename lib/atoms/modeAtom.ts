import { atom } from "jotai";
import { LsLongFormat } from "../types";

type Mode = "move" | "copy" | null;
export type ModeContext = {
    from: string;
    to: string;
    type: LsLongFormat['fileType'];
};

export const modeAtom = atom<{
    current: Mode;
    previous: Mode;
}>({
    current: null,
    previous: null,
});
export const modeContextAtom = atom<ModeContext | null>(null);