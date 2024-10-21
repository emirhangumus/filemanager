export type LsLongFormat = {
    id: string;
    fileType: 'file' | 'directory' | 'link' | 'other';
    permissions: {
        user: {
            read: boolean;
            write: boolean;
            execute: boolean;
        };
        group: {
            read: boolean;
            write: boolean;
            execute: boolean;
        };
        other: {
            read: boolean;
            write: boolean;
            execute: boolean;
        };
    }
    owner: string;
    size: number;
    lastModified: Date;
    name: string;
    fileExtension: string | null;
}

export type DirectoryTree = {
    [key: string]: DirectoryTree;
}

export type ExecType = "create-dir" | "delete-dir" | "delete-file" | "move" | "copy";

export type SafeReturn<T> = [Error | null, T | null];
