"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { directoryAtom } from "@/lib/atoms/directoryAtom";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { ICON_STROKE_WIDTH } from "@/lib/constants";
import { DirectoryTree } from "@/lib/types";
import { cn, realMerge } from "@/lib/utils";
import { useAtom } from "jotai";
import { ChevronDownIcon, ChevronUpIcon, Folder } from "lucide-react";
import { useEffect } from "react";

export const DirectoryRenderer = () => {

    const [path] = useAtom(pathAtom);
    const [directory, setDirectory] = useAtom(directoryAtom);

    useEffect(() => {
        const fetchData = async () => {
            if (!directory.invalidate) return;
            setDirectory((prev) => ({
                ...prev,
                loading: true,
            }));
            const res = await fetch("/api/list", {
                method: "POST",
                body: JSON.stringify({ path: path.currentPath, type: "directory-list" }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());

            if (res.success && directory.directories === null) {
                const allPaths: string[] = [];

                const getPaths = (tree: DirectoryTree, path: string) => {
                    for (const [key, value] of Object.entries(tree)) {
                        allPaths.push(path + '/' + key);
                        getPaths(value, path + '/' + key);
                    }
                }

                getPaths(res.data, "");

                setDirectory((prev) => {
                    return {
                        ...prev,
                        directories: res.data,
                        openDirectories: allPaths,
                        loading: false,
                        invalidate: false,
                    }
                });
            } else if (res.success && directory.directories !== null) {
                setDirectory((prev) => {
                    return {
                        ...prev,
                        openDirectories: [...prev.openDirectories, path.currentPath],
                        directories: realMerge(directory.directories ? directory.directories : {}, res.data),
                        loading: false,
                        invalidate: false,
                    }
                });
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [directory.invalidate]);

    return (
        <ScrollArea className="flex flex-col items-center gap-4 pr-4 h-full">
            {directory.directories && (
                <DirectoryTreeRenderer tree={directory.directories} level={0} path={""} />
            )}
        </ScrollArea>
    );
}

const DirectoryTreeRenderer = ({ tree, level, path }: { tree: DirectoryTree, level: number, path: string }) => {
    const [p, setPath] = useAtom(pathAtom);
    const [directories, setDirectory] = useAtom(directoryAtom);

    const changeDir = (path: string) => {
        setPath((prev) => ({
            ...prev,
            currentPath: path,
            pathStack: [...prev.pathStack, prev.currentPath],
            invalidate: true,
        }));
        setDirectory((prev) => ({
            ...prev,
            invalidate: true,
        }));
    }

    const toggleDir = (path: string) => {
        setDirectory((prev) => ({
            ...prev,
            openDirectories: prev.openDirectories.includes(path) ? prev.openDirectories.filter((item) => item !== path) : [...prev.openDirectories, path],
        }));
        console.log(directories);

    }

    return (
        <ul className={cn("w-full", { "py-4": level === 0 })}>
            {Object.entries(tree).map(([key, value]) => (
                <li key={key} className={cn("pl-2 w-full")}>
                    <div className={cn("flex items-center justify-between mb-2 border w-full px-2 py-1 rounded text-sm", {
                        "bg-zinc-900": path + '/' + key === p.currentPath
                    })}>
                        <button className="flex flex-1 items-center gap-2" onClick={() => changeDir(path + '/' + key)}>
                            <Folder strokeWidth={ICON_STROKE_WIDTH} className={cn("w-4 h-4", {
                                "text-blue-500": level % 8 === 0,
                                "text-green-500": level % 8 === 1,
                                "text-yellow-500": level % 8 === 2,
                                "text-red-500": level % 8 === 3,
                                "text-pink-500": level % 8 === 4,
                                "text-purple-500": level % 8 === 5,
                                "text-indigo-500": level % 8 === 6,
                                "text-cyan-500": level % 8 === 7,
                            })} />
                            <span>{key}</span>
                        </button>
                        <button className="z-10 bg-zinc-900 rounded relative" onClick={() => toggleDir(path + '/' + key)}>
                            {directories.openDirectories.includes(path + '/' + key) ? <ChevronDownIcon className="w-4 h-4" strokeWidth={ICON_STROKE_WIDTH} /> : <ChevronUpIcon className="w-4 h-4" strokeWidth={ICON_STROKE_WIDTH} />}
                        </button>
                    </div>
                    {Object.keys(value).length > 0 && directories.openDirectories.includes(path + '/' + key) && (
                        <DirectoryTreeRenderer tree={value} level={level + 1} path={`${path}/${key}`} />
                    )}
                </li>
            ))}
        </ul>
    );
}
