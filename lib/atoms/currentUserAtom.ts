import type { Account, User } from "@prisma/client";
import { atom } from "jotai";

export type CurrentUser = Omit<User, "password" | "createdAt" | "updatedAt"> & Omit<Account, "createdAt" | "updatedAt" | "userId">;

export const currentUserAtom = atom<CurrentUser>({} as CurrentUser);