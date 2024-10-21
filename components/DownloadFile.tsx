"use client";

import { ICON_STROKE_WIDTH } from "@/lib/constants";
import { LsLongFormat, SafeReturn } from "@/lib/types";
import { DownloadIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { ContextMenuItem } from "./ui/context-menu";
import { toast } from "sonner";

type DownloadFileProps = {
    file: LsLongFormat
};

export const DownloadFile = ({ file }: DownloadFileProps) => {
    const [downloadStatus, setDownloadStatus] = useState("");

    const downloadFavicon = async () => {
        try {
            toast.promise(new Promise(async (resolve, reject) => {
                const [error, status] = await downloadFile(file.id);
                if (error) {
                    reject(error);
                }
                resolve(status);
            }), {
                loading: 'Loading...',
                success: () => {
                    return "Downloaded."
                },
                error: (error) => {
                    return `Failed to download file: ${error.message}`;
                }
            });
        } catch (error) {
            console.error("Error downloading file:", error);
            setDownloadStatus("Error downloading");
        }
    };
    useEffect(() => {
        console.log("Download status:", downloadStatus);
    }, [downloadStatus]);

    return (
        <ContextMenuItem onClick={downloadFavicon}>
            <DownloadIcon className="w-4 h-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
            Download
        </ContextMenuItem>
    );
}

const downloadFile = async (path: string): Promise<SafeReturn<string>> => {
    try {
        const response = await axios.get("/api/download", {
            responseType: "blob",
            params: { path },
        });

        if (response.status !== 200) {
            return [new Error(response.data.error), null];
        }

        // Extract filename from content-disposition header
        const contentDisposition = response.headers["content-disposition"];
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        const fileName = fileNameMatch ? fileNameMatch[1] : "downloadedFile";

        // Create a temporary anchor element to trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        // Setting filename received in response
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return [null, "Downloaded"];
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error downloading file:", error);
            return [error, null];
        }
        return [new Error("Unknown error"), null];
    }
}

