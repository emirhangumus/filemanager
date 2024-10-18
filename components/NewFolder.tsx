"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { useAtom } from "jotai";
import { FolderInputIcon } from "lucide-react";
import { useState } from "react";

export const NewFolder = () => {

    const [open, setOpen] = useState(false);
    const [path, setPath] = useAtom(pathAtom);
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const createFolder = async () => {
        const response = await fetch("/api/exec", {
            method: "POST",
            body: JSON.stringify({
                path: path.currentPath,
                type: "create-dir",
                name,
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
            <DialogTrigger asChild>
                <Button>
                    <FolderInputIcon className="w-6 h-6" />
                    New Folder
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Folder</DialogTitle>
                    <DialogDescription>
                        Create a new folder in the current directory.
                    </DialogDescription>
                    <Input type="text" placeholder="Folder Name" value={name} onChange={(e) => setName(e.target.value)} />
                    {error && <p className="text-red-500">{error}</p>}
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant={'outline'}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={createFolder}
                    >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}