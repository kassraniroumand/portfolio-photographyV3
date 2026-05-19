import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  adminContentSchema,
  type AdminContentFormValues,
} from "../(dashboard)/admin/homepage/form/adminContentSchema";

const SINGLETON_ID = "singleton";

export const getHomePage = cache(
  async (): Promise<AdminContentFormValues | null> => {
    try {
      const record = await prisma.siteContent.findUnique({
        where: { id: SINGLETON_ID },
      });
      if (!record?.data) return null;

      const parsed = adminContentSchema.safeParse(record.data);
      if (!parsed.success) {
        console.warn(
          "home-homepage payload failed validation",
          parsed.error.issues,
        );
        return null;
      }
      return parsed.data;
    } catch (err) {
      console.error("getHomePage failed", err);
      return null;
    }
  },
);
