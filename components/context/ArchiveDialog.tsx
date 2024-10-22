"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dialogContextAtom } from "@/lib/atoms/dialogContextAtom";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { selectedsAtom } from "@/lib/atoms/selectedsAtom";
import { VALID_ARCHIVE_EXTENSIONS } from "@/lib/constants";
import { SelectValue } from "@radix-ui/react-select";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

const MAX_SHOW_SELECTEDS = 16;

export const ArchiveDialog = () => {
    const [open, setOpen] = useState(false);
    const [path, setPath] = useAtom(pathAtom);
    const [error, setError] = useState("");
    const [dialogContext, setDialogContext] = useAtom(dialogContextAtom);
    const [selecteds] = useAtom(selectedsAtom);
    const [outputName, setOutputName] = useState("");
    const [format, setFormat] = useState("");

    useEffect(() => {
        if (dialogContext.currentDialog === "archive") {
            setOpen(true);
            setDialogContext({ currentDialog: null, ref: dialogContext.ref });
        }
    }, [dialogContext.currentDialog, dialogContext.ref, setDialogContext]);

    const archive = async () => {
        const response = await fetch("/api/exec", {
            method: "POST",
            body: JSON.stringify({
                path: path.currentPath,
                type: "archive",
                name: outputName,
                items: selecteds,
                format,
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
                    <DialogTitle>
                        Archive
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to archive this files/folders?
                    </DialogDescription>
                    <div className="pt-4">
                        <div className="grid grid-cols-12 gap-2">
                            <Input placeholder="Output name" value={outputName} onChange={(e) => setOutputName(e.target.value)} className="col-span-8" />
                            <Select value={format} onValueChange={(value) => setFormat(value)}>
                                <SelectTrigger className="col-span-4">
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    {VALID_ARCHIVE_EXTENSIONS.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="font-semibold mb-2 mt-4">Selecteds:</p>
                        <ul className="flex flex-wrap items-center gap-2 mb-2">
                            {selecteds.map((item, i) => {

                                if (i > MAX_SHOW_SELECTEDS) {
                                    return null;
                                }

                                if (i == MAX_SHOW_SELECTEDS) {
                                    return (
                                        <li key={item}>
                                            <Badge>+{selecteds.length - MAX_SHOW_SELECTEDS}</Badge>
                                        </li>
                                    );
                                };

                                return (
                                    <li key={item}>
                                        <Badge>{item.split('/').pop()}</Badge>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant={'outline'}>Cancel</Button>
                    <Button onClick={archive}>
                        Archive
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}