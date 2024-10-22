import { appStateAtom, editingFileAtom } from "@/lib/atoms/appStateAtom";
import { ICON_STROKE_WIDTH } from "@/lib/constants";
import { useAtom } from "jotai";
import { Save, XIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner"
import { Button } from "./ui/button";

export const FileEdit = () => {
    const [editingFile, setEditingFile] = useAtom(editingFileAtom);
    const [appState, setAppState] = useAtom(appStateAtom);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const res = await fetch("/api/exec", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        path: appState.ref?.id,
                        items: [appState.ref?.id],
                        type: 'cat-file',
                    }),
                }).then((res) => res.json());

                if (res.success) {
                    setAppState((prev) => ({ ...prev, loading: false }));
                    setEditingFile(res.data);
                } else {
                    console.error(res.error);
                }

            } catch (error) {
                console.error(error);
            }
        }

        fetchFile();
    }, [appState.ref?.id, setAppState, setEditingFile]);

    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        const textarea = e.target as HTMLElement;
        const lineNumberDiv = document.getElementById("lineNumbers");
        if (!lineNumberDiv) return;
        lineNumberDiv.scrollTop = textarea.scrollTop; // Synchronize scrolling
    };

    if (appState.loading || editingFile === null) {
        return (
            <div>
                <span className="font-semibold">Loading...</span>
            </div>
        );
    }
    console.log(editingFile.split("\n"));

    const lineNumbers = editingFile.split("\n").length;

    return (
        <div className="flex h-full">
            <div
                id="lineNumbers"
                className="top-1 w-12 text-right p-2 bg-zinc-900 text-gray-500 text-sm font-mono overflow-scroll"
            >
                {Array.from({ length: lineNumbers }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                ))}
            </div>
            <textarea
                value={editingFile}
                onChange={(e) => setEditingFile(e.target.value)}
                onScroll={handleScroll} // Attach the scroll event handler
                className="outline-none w-full h-full p-2 text-sm font-mono bg-zinc-900 text-white"
            />
        </div>
    );
}

export const FileEditHeader = () => {
    const [appState, setAppState] = useAtom(appStateAtom);
    const [editingFile, setEditingFile] = useAtom(editingFileAtom);

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/exec`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'write-file',
                    path: appState.ref?.id,
                    content: editingFile ?? "",
                }),
            }).then((res) => res.json());

            if (res.success) {
                setAppState((prev) => ({ ...prev, state: "idle" }));
                setEditingFile(null);
                toast.success("File saved successfully", {
                    position: 'top-center',
                    description: `File ${appState.ref?.name} has been saved successfully.`,
                });
            } else {
                console.error(res.error);
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex items-center justify-between p-4 bg-zinc-950 w-full">
            <span className="font-semibold">Editing: <u>{appState.ref?.name}</u></span>
            <div className="flex items-center gap-2">
                <Button onClick={() => setAppState((prev) => ({ ...prev, state: "idle" }))}>
                    <XIcon className="w-8 h-8" strokeWidth={ICON_STROKE_WIDTH} />
                    Cancel
                </Button>
                <Button onClick={handleSave}>
                    <Save className="w-8 h-8" strokeWidth={ICON_STROKE_WIDTH} />
                    Save
                </Button>
            </div>
        </div>
    );
}
