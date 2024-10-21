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

export const isDirectory = (extenstion: string | null): boolean => {
  if (!extenstion) return false;
  return extenstion === "directory";
}

export const isImage = (extenstion: string | null): boolean => {
  if (!extenstion) return false;
  return ["png", "jpg", "jpeg", "gif", "webp", "bmp", "tiff", "tif"].includes(extenstion);
}

export const isAudio = (extenstion: string | null): boolean => {
  if (!extenstion) return false;
  return ["mp3", "wav", "ogg"].includes(extenstion);
}

export const isVideo = (extenstion: string | null): boolean => {
  if (!extenstion) return false;
  return ["mp4", "webm", "ogv"].includes(extenstion);
}

export const isText = (extenstion: string | null): boolean => {
  if (!extenstion) return false;
  return ["txt", "html", "css", "js", "json", "xml", "csv", "tsv", "ics", "vcs", "vcf", "vcard"].includes(extenstion);
}

export const isDocument = (extenstion: string | null): boolean => {
  if (!extenstion) return false;
  return ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extenstion);
}

export const isProgramingRelatedFile = (extenstion: string | null): boolean => {
  if (!extenstion) return false;
  return ["html", "css", "js", "json", "xml", "csv", "tsv", "ts"].includes(extenstion);
}

export const getContentType = (extention?: string) => {

  if (!extention) return "application/octet-stream";

  switch (extention) {
    case "pdf":
      return "application/pdf";
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "mp4":
      return "video/mp4";
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "txt":
      return "text/plain";
    case "html":
      return "text/html";
    case "css":
      return "text/css";
    case "js":
      return "application/javascript";
    case "json":
      return "application/json";
    case "xml":
      return "application/xml";
    case "zip":
      return "application/zip";
    case "tar":
      return "application/x-tar";
    case "gz":
      return "application/gzip";
    case "7z":
      return "application/x-7z-compressed";
    case "rar":
      return "application/vnd.rar";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xls":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "ppt":
      return "application/vnd.ms-powerpoint";
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "csv":
      return "text/csv";
    case "tsv":
      return "text/tab-separated-values";
    case "ics":
      return "text/calendar";
    case "vcs":
      return "text/x-vcalendar";
    case "ics":
      return "text/calendar";
    case "vcs":
      return "text/x-vcalendar";
    case "vcf":
      return "text/x-vcard";
    case "vcard":
      return "text/x-vcard";
    case "svg":
      return "image/svg+xml";
    case "webp":
      return "image/webp";
    case "bmp":
      return "image/bmp";
    case "tiff":
      return "image/tiff";
    case "tif":
      return "image/tiff";
    case "webm":
      return "video/webm";
    case "ogg":
      return "audio/ogg";
    case "ogv":
      return "video/ogg";
    case "ogx":
      return "application/ogg";
    default:
      return "application/octet-stream";
  }
}
