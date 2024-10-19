"use client";

import { NewFolder } from "@/components/NewFolder";
import { Button } from "@/components/ui/button";
import { contentAtom } from "@/lib/atoms/contentAtom";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { selectedsAtom } from "@/lib/atoms/selectedsAtom";
import { ICON_STROKE_WIDTH } from "@/lib/constants";
import { useMode } from "@/lib/hooks/useModHook";
import { useAtom } from "jotai";
import { ArrowLeftIcon, ClipboardCopy, DeleteIcon, DownloadIcon, FolderInputIcon, RefreshCcwIcon, UploadIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { LsLongFormat } from "@/lib/types";
import { dialogContextAtom } from "@/lib/atoms/dialogContextAtom";

export const ActionBar = () => {
    const { mode, setMode, setModeContext } = useMode();
    const [selecteds, setSelecteds] = useAtom(selectedsAtom);
    const [path, setPath] = useAtom(pathAtom);
    const [content] = useAtom(contentAtom);
    const [localType, setLocalType] = useState<LsLongFormat['fileType'] | undefined>(undefined);
    const [, setDialogContext] = useAtom(dialogContextAtom);
    const [selectedWithContent, setSelectedWithContent] = useState<LsLongFormat[]>([]);

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

    const selectAll = () => {
        setSelecteds((prev) => {
            if (prev.length === content.raw.length) {
                return [];
            } else {
                return content.raw.map((item) => item.id);
            }
        });
    }

    useEffect(() => {
        if (selecteds.length > 0) {
            setSelectedWithContent(content.raw.filter((item) => selecteds.includes(item.id)));
        } else {
            setSelectedWithContent([]);
        }
    }, [selecteds, content.raw]);

    useEffect(() => {
        if (selecteds.length === 1) {
            const item = content.raw.find((item) => item.id === selecteds[0]);
            if (item) {
                setLocalType(item.fileType);
            }
        } else {
            // check if all selected items are of the same type
            const types = content.raw.filter((item) => selecteds.includes(item.id)).map((item) => item.fileType);
            if (types.every((type) => type === 'file')) {
                setLocalType('file');
            } else if (types.every((type) => type === 'directory')) {
                setLocalType('directory');
            } else {
                setLocalType(undefined);
            }
        }
    }, [selecteds, content.raw]);

    if (mode) {
        return (
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 p-4">
                    <button onClick={goBack} disabled={path.pathStack.length === 0} className="disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowLeftIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                    </button>
                    <span className="font-semibold">{mode === 'move' ? 'Moving' : 'Copying'} {selecteds.length} items</span>
                </div>
                <div className="flex items-center gap-4 p-4">
                    <Button onClick={() => setMode(null)}>
                        <XIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                        Cancel
                    </Button>
                    <Button onClick={() => setModeContext()}>
                        <ClipboardCopy className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                        {mode === 'move' ? 'Move' : 'Copy'}
                    </Button>
                </div>
            </div>
        )
    }

    if (selecteds.length === 0) {
        return (
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 p-4">
                    <Checkbox checked={selecteds.length === content.raw.length} onCheckedChange={selectAll} className="mr-4" />
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
                <Checkbox checked={selecteds.length === content.raw.length} onCheckedChange={selectAll} className="mr-4" />
                <button onClick={goBack} disabled={path.pathStack.length === 0} className="disabled:opacity-50 disabled:cursor-not-allowed">
                    <ArrowLeftIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                </button>
                <DownloadIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                <div className="border-r h-full"></div>
                <button onClick={() => setMode('move', localType)} disabled={!localType} className="disabled:opacity-50 disabled:cursor-not-allowed">
                    <FolderInputIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                </button>
                <button onClick={() => setMode('copy', localType)} disabled={!localType} className="disabled:opacity-50 disabled:cursor-not-allowed">
                    <ClipboardCopy className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                </button>
                <div className="border-r h-full"></div>
                <button onClick={() => setDialogContext({ currentDialog: localType == 'directory' ? 'delete-folder' : 'delete-file', ref: selectedWithContent[0] ? selectedWithContent[0] : null })} disabled={!localType} className="disabled:opacity-50 disabled:cursor-not-allowed">
                    <DeleteIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                </button>
            </div>
            <div>
                <button className="p-4" onClick={() => setSelecteds([])}>
                    <XIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />
                </button>
            </div>
        </div>
    );
}