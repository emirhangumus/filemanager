"use client";

import { ActionBar } from "@/components/ActionBar";
import { ContentRenderer } from "@/components/ContentRenderer";
import { DeleteFile } from "@/components/context/DeleteFile";
import { DeleteFolder } from "@/components/context/DeleteFolder";
import { FileUpload } from "@/components/context/FileUpload";
import { ModeDialog } from "@/components/context/ModeDialog";
import { RenameDialog } from "@/components/context/RenameDialog";
import { DirectoryRenderer } from "@/components/DirectoryRenderer";
import { Footer } from "@/components/Footer";
import { SearchPopup } from "@/components/SearchPopup";
import { TestComponent } from "@/components/TestComponent";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { contentAtom } from "@/lib/atoms/contentAtom";
import { currentUserAtom } from "@/lib/atoms/currentUserAtom";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { useMode } from "@/lib/hooks/useModHook";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { ArchiveDialog } from "./context/ArchiveDialog";
import { LogoutButton } from "./LogoutButton";

export function FileManager() {
    const [path, setPath] = useAtom(pathAtom);
    const [, setContent] = useAtom(contentAtom);
    const { mode } = useMode();
    const [user] = useAtom(currentUserAtom);

    useEffect(() => {
        const fetchData = async () => {
            if (!path.invalidate) return;
            setPath((prev) => ({
                ...prev,
                loading: true,
            }));
            const res = await fetch("/api/list", {
                method: "POST",
                body: JSON.stringify({ path: path.currentPath, type: "content-list" }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());

            if (res.success) {
                setContent({
                    raw: res.data,
                    filteredContent: res.data,
                });
                setPath((prev) => ({
                    ...prev,
                    loading: false,
                    invalidate: false,
                }));
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path.invalidate]);

    if (!user) {
        return null;
    }

    return (
        <div className="flex flex-col w-full gap-4 py-8">
            <div className="flex justify-between items-center container mx-auto">
                <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500">Welcome, {user.username}</div>
                </div>
                <LogoutButton />
            </div>
            <div className="container mx-auto h-[800px] border">
                <ResizablePanelGroup
                    direction="horizontal"
                    className={cn("border", { "border-indigo-800 shadow shadow-indigo-400": mode != null })}
                >
                    <ResizablePanel defaultSize={16}>
                        <DirectoryRenderer />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50}>
                        <ResizablePanelGroup direction="vertical">
                            <ResizablePanel defaultSize={6} className="flex h-full">
                                <ActionBar />
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={75}>
                                <ContentRenderer />
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
                <SearchPopup />
                <ModeDialog />
                <DeleteFolder />
                <DeleteFile />
                <FileUpload />
                <RenameDialog />
                <ArchiveDialog />
                <Footer />
                <TestComponent />
            </div>
        </div>
    );
}

