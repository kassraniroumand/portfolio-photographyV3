import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  type AdminContentFormValues,
} from "../(dashboard)/admin/homepage/form/adminContentSchema";
import { adminEmptyContent } from "../(dashboard)/admin/homepage/form/emptyContent";

const SINGLETON_ID = "singleton";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(override)) return base;
  if (!isPlainObject(base)) return (override as T) ?? base;

  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const baseVal = (base as Record<string, unknown>)[key];
    const overrideVal = override[key];
    if (isPlainObject(baseVal) && isPlainObject(overrideVal)) {
      result[key] = deepMerge(baseVal, overrideVal);
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal;
    }
  }
  return result as T;
}

export const getHomePage = cache(
  async (): Promise<AdminContentFormValues> => {
    try {
      const record = await prisma.siteContent.findUnique({
        where: { id: SINGLETON_ID },
      });
      if (!record?.data) return adminEmptyContent;

      return deepMerge(adminEmptyContent, record.data);
    } catch (err) {
      console.error("getHomePage failed", err);
      return adminEmptyContent;
    }
  },
);
