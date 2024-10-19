"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dialogContextAtom } from "@/lib/atoms/dialogContextAtom";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export const DeleteFile = () => {
    const [open, setOpen] = useState(false);
    const [path, setPath] = useAtom(pathAtom);
    const [error, setError] = useState("");
    const [dialogContext, setDialogContext] = useAtom(dialogContextAtom);

    useEffect(() => {
        if (dialogContext.currentDialog === "delete-file") {
            setOpen(true);
            setDialogContext({ currentDialog: null, ref: dialogContext.ref });
        }
    }, [dialogContext.currentDialog, dialogContext.ref, setDialogContext]);

    const createFile = async () => {
        const response = await fetch("/api/exec", {
            method: "POST",
            body: JSON.stringify({
                path: path.currentPath,
                type: "delete-file",
                name: dialogContext.ref?.name
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());

        if (response.success) {
            setPath((prev) => ({
                ...prev,
                invalidate: true,
            }));
            setOpen(false);
        } else {
            setError(response.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete File</DialogTitle>
                    <DialogDescription>
                        Delete a file in the current directory.
                    </DialogDescription>
                    {error && <p className="text-red-500">{error}</p>}
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={createFile}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}