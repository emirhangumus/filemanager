"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dialogContextAtom } from "@/lib/atoms/dialogContextAtom";
import { selectedsAtom } from "@/lib/atoms/selectedsAtom";
import { useMode } from "@/lib/hooks/useModHook";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export const ModeDialog = () => {
    const { mode, setModeContext, context, cancel } = useMode();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [dialogContext, setDialogContext] = useAtom(dialogContextAtom);
    const [selecteds] = useAtom(selectedsAtom);

    useEffect(() => {
        if (dialogContext.currentDialog === "mode-dialog") {
            setOpen(true);
            setDialogContext({ currentDialog: null, ref: dialogContext.ref });
        }
    }, [dialogContext.currentDialog, dialogContext.ref, setDialogContext]);

    return (
        <Dialog open={open} onOpenChange={() => {
            cancel();
            setOpen(false);
            setError("");
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Are you sure?
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'move' ? 'Move' : 'Copy'} {selecteds.length} items to {context?.to}
                    </DialogDescription>
                    {error && <p className="text-red-500">{error}</p>}
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                        const ret = setModeContext();
                        if (ret instanceof Error) {
                            setError(ret.message);
                            return;
                        }

                        setOpen(false);
                    }}>
                        {mode === 'move' ? 'Move' : 'Copy'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}