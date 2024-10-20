"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dialogContextAtom } from "@/lib/atoms/dialogContextAtom";
import { directoryAtom } from "@/lib/atoms/directoryAtom";
import { pathAtom } from "@/lib/atoms/pathAtom";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";

export const RenameDialog = () => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [dialogContext, setDialogContext] = useAtom(dialogContextAtom);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [, setPath] = useAtom(pathAtom);
    const [, setDirectory] = useAtom(directoryAtom);

    useEffect(() => {
        if (dialogContext.currentDialog === "rename") {
            setOpen(true);
            setName(dialogContext.ref?.name || "");
            setDialogContext({ currentDialog: null, ref: dialogContext.ref });
        }
    }, [dialogContext.currentDialog, dialogContext.ref, setDialogContext]);

    const rename = async () => {
        setLoading(true);
        if (!name) {
            setError("Name cannot be empty");
            return;
        }

        const data = await axios.post("/api/exec", {
            name,
            path: dialogContext.ref?.id,
            type: "rename",
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!data.data.success) {
            setError(data.data.error);
            setLoading(false);
            return;
        }

        toast.success("Renamed successfully", {
            position: 'top-center'
        });

        setPath((prev) => ({ ...prev, invalidate: true }));
        setDirectory((prev) => ({ ...prev, invalidate: true }));

        // Close the dialog
        setOpen(false);

        // Do the rename here
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={() => {
            setOpen(false);
            setError("");
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Rename
                    </DialogTitle>
                    <DialogDescription>
                        Rename the selected file or folder
                    </DialogDescription>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                    {error && <p className="text-red-500">{error}</p>}
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={async () => {
                            await rename();
                            setOpen(false);
                        }}
                        disabled={loading}
                    >
                        {loading ? "Renaming..." : "Rename"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}