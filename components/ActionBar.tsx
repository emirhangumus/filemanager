"use client";

import { NewFolder } from "@/components/NewFolder";
import { Button } from "@/components/ui/button";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { selectedsAtom } from "@/lib/atoms/selectedsAtom";
import { ICON_STROKE_WIDTH } from "@/lib/constants";
import { useAtom } from "jotai";
import { ArrowLeftIcon, ClipboardCopy, DeleteIcon, DownloadIcon, FolderInputIcon, RefreshCcwIcon, UploadIcon, XIcon } from "lucide-react";
import { useCallback } from "react";

export const ActionBar = () => {
    const [selecteds, setSelecteds] = useAtom(selectedsAtom);
    const [path, setPath] = useAtom(pathAtom);

    const goBack = useCallback(() => {
        setPath((prev) => {
            const pathStack = [...prev.pathStack];
            if (pathStack.length === 0) return prev;
            const currentPath = pathStack.pop();
            if (!currentPath) return prev;
            return {
                ...prev,
                pathStack,
                currentPath,
                invalidate: true,
            };
        });
    }, [setPath]);

    if (selecteds.length === 0) {
        return (
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 p-4">
                    <button onClick={goBack} disabled={path.pathStack.length === 0} className="disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowLeftIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                    </button>
                    <NewFolder />
                    <Button>
                        <UploadIcon className="w-6 h-6" />
                        Upload Files
                    </Button>
                </div>
                <div className="flex items-center gap-4 p-4">
                    <Button onClick={() => setPath((prev) => ({ ...prev, invalidate: true }))}>
                        <RefreshCcwIcon className="w-6 h-6" />
                        Refresh
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4 p-4">
                <DownloadIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                <div className="border-r h-full"></div>
                <FolderInputIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                <ClipboardCopy className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                <div className="border-r h-full"></div>
                <DeleteIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
            </div>
            <div>
                <button className="p-4" onClick={() => setSelecteds([])}>
                    <XIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                </button>
            </div>
        </div>
    );
}