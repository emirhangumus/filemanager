"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dialogContextAtom } from "@/lib/atoms/dialogContextAtom";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { cn } from "@/lib/utils";
import axios, { AxiosRequestConfig } from "axios";
import { useAtom } from "jotai";
import { UploadIcon, XIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Progress } from "../ui/progress";
import { directoryAtom } from "@/lib/atoms/directoryAtom";

const ALLOWED_FORMATS = ["tar", "zip"] as const;

export const FileUpload = () => {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error] = useState("");
    const [dialogContext, setDialogContext] = useAtom(dialogContextAtom);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [path, setPath] = useAtom(pathAtom);
    const [, setDirectory] = useAtom(directoryAtom)

    useEffect(() => {
        if (dialogContext.currentDialog === "file-upload") {
            setOpen(true);
            setDialogContext({ currentDialog: null, ref: dialogContext.ref });
        }
    }, [dialogContext.currentDialog, dialogContext.ref, setDialogContext]);

    const upload = async () => {
        if (!file) {
            return;
        }

        setUploading(true);

        try {
            let formData = new FormData();
            formData.append("file", file);
            formData.append("path", path.currentPath);
            formData.append("type", "upload");

            const options: AxiosRequestConfig = {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentage = (progressEvent.loaded * 100) / (progressEvent.total || 1);
                    setProgress(+percentage.toFixed(2));
                },
            };

            const data = await axios.post("/api/upload", formData, options);


            if (!data.data.success) {
                toast.error(data.data.error);
                return;
            }

            toast.success("File uploaded successfully");
            setFile(null);
            setProgress(0);
            setOpen(false);
            setPath((prev) => ({ ...prev, invalidate: true }));
            setDirectory((prev) => ({ ...prev, invalidate: true }));
        } catch (e: any) {
            console.error(e);
            const error =
                e.response && e.response.data
                    ? e.response.data.error
                    : "Sorry! something went wrong.";
            toast.error(error);
        }

        setUploading(false);
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Upload File
                    </DialogTitle>
                    <DialogDescription>
                        Upload a file to the current directory.
                    </DialogDescription>
                    <div className="py-4">
                        <DragDropFileArea count={1} onFileChange={(files) => setFile(files[0])} />
                    </div>
                    <Progress value={progress} className={cn("opacity-20", { "opacity-100": uploading })} />
                    {error && <p className="text-red-500">{error}</p>}
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={upload}>
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


function DragDropFileArea({
    onFileChange,
    count,
}: {
    onFileChange: (files: File[]) => void;
    count: number;
}) {
    const dropContainer = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);

    function handleDrop(e: DragEvent | ChangeEvent<HTMLInputElement>) {
        let files;
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);

        if (e instanceof DragEvent) {
            if (!e.dataTransfer || !e.dataTransfer.files) {
                return;
            }
            files = [...e.dataTransfer.files];
        } else {
            if (!e.target.files) {
                return;
            }
            files = [...e.target.files];
        }

        const allFilesValid = files.every((file) => {
            return ALLOWED_FORMATS.some((format) => file.type.endsWith(`/${format}`));
        });

        if (!allFilesValid) {
            toast.error("Invalid file format");
            return;
        }
        if (count && count < files.length) {
            toast.error(`Only ${count} file${count > 1 ? "s" : ""} can be uploaded`);
            return;
        }

        if (files && files.length) {
            setFiles(files);
            onFileChange(files);
        }
    }

    useEffect(() => {
        function handleDragOver(e: DragEvent) {
            e.preventDefault();
            e.stopPropagation();
            setDragging(true);
        }
        function handleDragLeave(e: DragEvent) {
            e.preventDefault();
            e.stopPropagation();
            setDragging(false);
        }
        if (!dropContainer.current) return;

        dropContainer.current.addEventListener("dragover", handleDragOver);
        dropContainer.current.addEventListener("drop", handleDrop);
        dropContainer.current.addEventListener("dragleave", handleDragLeave);

        return () => {
            if (!dropContainer.current) return;
            dropContainer.current.removeEventListener("dragover", handleDragOver);
            dropContainer.current.removeEventListener("drop", handleDrop);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            dropContainer.current.removeEventListener("dragleave", handleDragLeave);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div
                className={cn("rounded-md border border-dashed relative flex flex-col justify-center items-center text-center py-12 h-48", {
                    "border-blue-400 bg-blue-950 bg-opacity-40": dragging,
                })}
                ref={dropContainer}
            >
                <input
                    className="opacity-0 hidden"
                    type="file"
                    accept={ALLOWED_FORMATS.map((format) => `.${format}`).join(",")}
                    ref={fileRef}
                    onChange={(e) => handleDrop(e)}
                />
                {(files.length > 0) ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="text-[12px] font-normal text-gray-500">
                            {files.map((file) => (
                                <div key={file.name} className="flex items-center gap-2">
                                    <XIcon size={16} className="text-red-500 cursor-pointer" onClick={() => setFiles([])} />
                                    <span>{file.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="mx-auto text-gray-400 mb-2">
                            <UploadIcon size={18} />
                        </div>
                        <div className="text-[12px] font-normal text-gray-500">
                            <span
                                className="text-[#4070f4] cursor-pointer"
                                onClick={() => {
                                    if (fileRef.current)
                                        fileRef.current.click();
                                }}
                            >
                                Click to upload
                            </span>{" "}
                            or drag and drop
                        </div>
                        <div className="text-[10px] font-normal text-gray-500">
                            Only {ALLOWED_FORMATS.join(", ")} files are allowed
                        </div>
                    </div >
                )
                }
            </div >
        </>
    );
}
