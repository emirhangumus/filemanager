import { modeAtom, ModeContext, modeContextAtom } from "@/lib/atoms/modeAtom";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { LsLongFormat } from "../types";
import { dialogContextAtom } from "../atoms/dialogContextAtom";
import { selectedsAtom } from "../atoms/selectedsAtom";
import { directoryAtom } from "../atoms/directoryAtom";

export const useMode = () => {
    const [mode, _setMode] = useAtom(modeAtom);
    const [modeContext, _setModeContext] = useAtom(modeContextAtom);
    const [path, setPath] = useAtom(pathAtom);
    const [, setDirectory] = useAtom(directoryAtom);
    const [, setDialogContext] = useAtom(dialogContextAtom);
    const [selecteds, setSelecteds] = useAtom(selectedsAtom);

    const setModeContext = async () => {
        console.log(path.currentPath, mode, modeContext);

        if (!path.currentPath || !mode || !modeContext) return;
        const currentContext = modeContext;
        if (currentContext && currentContext.from && !currentContext.to) {
            _setModeContext({
                ...currentContext,
                to: path.currentPath
            });
            setDialogContext({
                currentDialog: "mode-dialog",
                ref: null,
            });
            return;
        }
        const ret = await _send(currentContext);
        _setModeContext(null);
        _setMode((prev) => {
            return {
                current: null,
                previous: prev.current,
            }
        });
        return ret;
    }

    useEffect(() => {
        if (mode.previous) {
            _setModeContext(null);
            _setMode((prev) => {
                return {
                    current: prev.previous,
                    previous: null,
                }
            });
        }
    }, [_setModeContext, mode, _setMode]);

    const setMode = (mode: "move" | "copy" | null, type?: LsLongFormat['fileType']) => {
        console.log(mode, type);

        if (!mode || !type) {
            _setMode((prev) => {
                return {
                    current: null,
                    previous: prev.current
                }
            });
            _setModeContext(null);
            return;
        }
        _setMode((prev) => {
            return {
                current: mode,
                previous: prev.current
            }
        });
        _setModeContext({
            from: path.currentPath,
            to: "",
            type: type,
        });
    }

    const _send = async (c: ModeContext) => {


        const res = await fetch("/api/exec", {
            method: "POST",
            body: JSON.stringify({
                from: c.from,
                to: c.to,
                type: mode.current,
                path: path.currentPath,
                items: selecteds,
                selectType: c.type,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());

        if (res.success) {
            setPath((prev) => ({ ...prev, invalidate: true }))
            setDirectory((prev) => ({ ...prev, invalidate: true }))
            setSelecteds([]);
            return res;
        }

        throw new Error("Failed to move/copy files.");
    }

    const cancel = () => {
        _setMode((prev) => {
            return {
                current: null,
                previous: prev.current
            }
        });
        _setModeContext(null);
    }

    return { mode: mode.current, setMode, context: modeContext, setModeContext, cancel };
}
