"use client";

import { DeleteFolder } from "@/components/context/DeleteFolder";
import { Checkbox } from "@/components/ui/checkbox";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { contentAtom } from "@/lib/atoms/contentAtom";
import { dialogContextAtom } from "@/lib/atoms/dialogContextAtom";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { selectedsAtom } from "@/lib/atoms/selectedsAtom";
import { ICON_STROKE_WIDTH } from "@/lib/constants";
import { useMode } from "@/lib/hooks/useModHook";
import { LsLongFormat } from "@/lib/types";
import { useAtom } from "jotai";
import { ClipboardCopy, DeleteIcon, DownloadIcon, Edit2Icon, FileIcon, FileQuestionIcon, Folder, FolderInputIcon, LinkIcon, RefreshCcwIcon } from "lucide-react";
import { DeleteFile } from "./context/DeleteFile";

export const ContentRenderer = () => {
    const { mode, setMode } = useMode();
    const [content] = useAtom(contentAtom);
    const [selecteds, setSelecteds] = useAtom(selectedsAtom);
    const [path, setPath] = useAtom(pathAtom);
    const [, setDialogContext] = useAtom(dialogContextAtom);

    const selectItem = (id: string) => {
        setSelecteds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    }

    const onDoubleClick = (id: LsLongFormat) => {
        if (id.fileType === 'directory') {
            setPath((prev) => ({
                ...prev,
                currentPath: id.id,
                pathStack: [...prev.pathStack, prev.currentPath],
                invalidate: true,
            }));
        }
    }

    if (path.loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="font-semibold">Loading...</span>
            </div>
        );
    }

    if (content.raw.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="font-semibold">No files found.</span>
            </div>
        );
    }

    return (
        <>
            <ScrollArea className="h-full">
                {content.filteredContent.map((file) => (
                    <ContextMenu key={file.id}>
                        <ContextMenuTrigger className="flex items-center p-2 border-b hover:bg-zinc-900 transition-colors gap-8 px-4" onDoubleClick={() => onDoubleClick(file)}>
                            {!mode ? <Checkbox checked={selecteds.includes(file.id)} onCheckedChange={() => selectItem(file.id)} /> : null}
                            <div className="flex items-center gap-2">
                                <FileIconRenderer fileType={file.fileType} />
                                <span>{file.name}</span>
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-64">
                            <ContextMenuItem>
                                <Edit2Icon className="w-4 h-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                                Rename
                            </ContextMenuItem>
                            <ContextMenuItem onClick={() => {
                                selectItem(file.id);
                                setMode('move', file.fileType);
                            }}>
                                <FolderInputIcon className="w-4 h-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                                Move
                            </ContextMenuItem>
                            <ContextMenuItem onClick={() => {
                                selectItem(file.id);
                                setMode('copy', file.fileType);
                            }}>
                                <ClipboardCopy className="w-4 h-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                                Copy
                            </ContextMenuItem>
                            <ContextMenuItem onClick={() => setDialogContext({ currentDialog: file.fileType == 'directory' ? 'delete-folder' : 'delete-file', ref: file })}>
                                <DeleteIcon className="w-4 h-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                                Delete
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem>
                                <RefreshCcwIcon className="w-4 h-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                                Refresh
                            </ContextMenuItem>
                            <ContextMenuItem>
                                <DownloadIcon className="w-4 h-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
                                Download
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                ))}
                <DeleteFolder />
                <DeleteFile />
            </ScrollArea>
        </>
    );
}

const FileIconRenderer = ({ fileType }: { fileType: LsLongFormat['fileType'] }) => {
    return (
        <>
            {fileType === 'file' && <FileIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />}
            {fileType === 'directory' && <Folder className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />}
            {fileType === 'link' && <LinkIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />}
            {fileType === 'other' && <FileQuestionIcon className="w-6 h-6" strokeWidth={ICON_STROKE_WIDTH} />}
        </>
    )
}

