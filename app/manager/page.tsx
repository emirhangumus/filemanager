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
import { pathAtom } from "@/lib/atoms/pathAtom";
import { useMode } from "@/lib/hooks/useModHook";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { useEffect } from "react";

export default function Page() {
    const [path, setPath] = useAtom(pathAtom);
    const [, setContent] = useAtom(contentAtom);
    const { mode } = useMode();

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

    return (
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
            <Footer />
            <TestComponent />
        </div>
    );
}

