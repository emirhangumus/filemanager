import axios from "axios";
import { ContextMenuItem } from "./ui/context-menu";
import { PickaxeIcon } from "lucide-react";
import { ICON_STROKE_WIDTH } from "@/lib/constants";
import { LsLongFormat } from "@/lib/types";
import { useAtom } from "jotai";
import { pathAtom } from "@/lib/atoms/pathAtom";
import { toast } from "sonner";

type ExtractArchiveProps = {
    file: LsLongFormat;
}

export const ExtractArchive = ({ file }: ExtractArchiveProps) => {
    const [path, setPath] = useAtom(pathAtom);
    const [, setDirectory] = useAtom(pathAtom);

    return (
        <ContextMenuItem onClick={async () => {
            const data = await axios.post('/api/exec', {
                path: file.id,
                type: 'extract',
                extractType: file.fileExtension,
                target: path.currentPath,
                source: file.id,
            });

            if (data.data.success) {
                setPath((prev) => ({ ...prev, invalidate: true }));
                setDirectory((prev) => ({ ...prev, invalidate: true }));
            } else {
                toast.error(data.data.error);
            }
        }}>
            <PickaxeIcon className="w-4 h-4 mr-2" strokeWidth={ICON_STROKE_WIDTH} />
            Extract
        </ContextMenuItem>
    )
}