import { Input } from "@/components/ui/input";
import { contentAtom } from "@/lib/atoms/contentAtom";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

export const SearchPopup = () => {
    const [, setPath] = useAtom(pathAtom);
    const [, setContent] = useAtom(contentAtom);
    const [searchValue, setSearchValue] = useState("");
    const [openSearch, setOpenSearch] = useState(false);

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

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Backspace") {
                goBack();
            }

            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpenSearch((prev) => !prev);
                if (!openSearch) {
                    setTimeout(() => {
                        document.getElementById("filesearch")?.focus();
                    }, 0);
                } else {
                    setSearchValue("");
                }
            }

            if (e.key === "Escape") {
                setOpenSearch(false);
                setSearchValue("");
            }

            if (e.key === "Enter") {
                setOpenSearch(false);
            }
        });
        return () => {
            window.removeEventListener("keydown", () => { });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (searchValue === "") {
            setContent((prev) => ({
                ...prev,
                filteredContent: prev.raw,
            }));
            return;
        }

        setContent((prev) => ({
            ...prev,
            filteredContent: prev.raw.filter((file) => file.name.includes(searchValue)),
        }));
    }, [searchValue, setContent]);

    return (
        <div className={cn("absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center", { hidden: !openSearch })}>
            <div className="bg-zinc-900 w-96 rounded-lg">
                <Input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} id="filesearch" placeholder="Search..." />
            </div>
        </div>
    )
}