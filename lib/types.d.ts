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
}

export type DirectoryTree = {
    [key: string]: DirectoryTree;
}