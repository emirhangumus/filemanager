import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { VALID_ARCHIVE_EXTENSIONS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function realMerge(to: Record<string, any>, from: Record<string, any>) {

  // Make sure to make a shallow copy first, otherwise
  // the original objects are mutated. 
  to = { ...to };
  from = { ...from };

  let n;
  for (n in from) {
    if (typeof to[n] != 'object') {
      to[n] = from[n];
    } else if (typeof from[n] == 'object') {
      to[n] = realMerge(to[n], from[n]);
    }
  }
  return to;
};

export const isArchive = (extenstion: string | null): boolean => {
  if (!extenstion) return false;
  return VALID_ARCHIVE_EXTENSIONS.includes(extenstion as typeof VALID_ARCHIVE_EXTENSIONS[number]);
}