export const CONTENT_LIST_COMMAND = "eza -l --long --color=never --time-style=long-iso --bytes" as const;
export const DIRECTORY_LIST_COMMAND = "eza -dDRl -L 1 --long --color=never --time-style=long-iso --bytes" as const;
export const ICON_STROKE_WIDTH = 1.5 as const;
export const VALID_ARCHIVE_EXTENSIONS = ["zip", "tar"] as const;
export const SESSION_COOKIE_NAME = "fm_session" as const;