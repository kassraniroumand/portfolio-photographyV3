import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  UserModel as User,
  ImagesModel as Image,
} from "@/lib/generated/prisma/models";
import type { AdminContentFormValues } from "../../app/(dashboard)/admin/homepage/form/adminContentSchema";
import type { PortfolioFormValues } from "@/app/(dashboard)/admin/portfolio/page/form/portfolioSchema";

type SiteContentRecord = {
  id: string;
  data: AdminContentFormValues | null;
  createdAt?: string;
  updatedAt?: string;
};

type PortfolioRecord = {
  id: string;
  data: PortfolioFormValues | null;
  createdAt?: string;
  updatedAt?: string;
};

export type VideoBlob = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["User", "Image", "Video", "SiteContent", "Portfolio"],
  endpoints: (build) => ({
    listUsers: build.query<User[], void>({
      query: () => "/admin/users",
      providesTags: (result) =>
        result
          ? [
              ...result.map((u) => ({ type: "User" as const, id: u.id })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),
    createUser: build.mutation<User, { name: string; email: string }>({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    setUserRole: build.mutation<User, { id: string; role: "admin" | "user" }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    listImages: build.query<Image[], void>({
      query: () => "/admin/images",
      providesTags: (result) =>
        result
          ? [
              ...result.map((i) => ({ type: "Image" as const, id: i.id })),
              { type: "Image" as const, id: "LIST" },
            ]
          : [{ type: "Image" as const, id: "LIST" }],
    }),
    finalizeImage: build.mutation<
      Image,
      { url: string; width: number; height: number }
    >({
      query: (body) => ({
        url: "/admin/images/finalize",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Image", id: "LIST" }],
    }),
    deleteImage: build.mutation<void, string>({
      query: (id) => ({
        url: `/admin/images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Image", id },
        { type: "Image", id: "LIST" },
      ],
    }),

    listVideos: build.query<VideoBlob[], void>({
      query: () => "/admin/videos",
      providesTags: (result) =>
        result
          ? [
              ...result.map((v) => ({
                type: "Video" as const,
                id: v.pathname,
              })),
              { type: "Video" as const, id: "LIST" },
            ]
          : [{ type: "Video" as const, id: "LIST" }],
    }),
    invalidateVideos: build.mutation<null, void>({
      queryFn: () => ({ data: null }),
      invalidatesTags: [{ type: "Video", id: "LIST" }],
    }),
    deleteVideo: build.mutation<void, string>({
      query: (url) => ({
        url: `/admin/videos?url=${encodeURIComponent(url)}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Video", id: "LIST" }],
    }),

    getSiteContent: build.query<SiteContentRecord, void>({
      query: () => "/admin/homepage",
      providesTags: [{ type: "SiteContent", id: "SINGLETON" }],
    }),
    saveSiteContent: build.mutation<SiteContentRecord, AdminContentFormValues>({
      query: (body) => ({
        url: "/admin/homepage",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "SiteContent", id: "SINGLETON" }],
    }),
    saveSiteContentSection: build.mutation<
      SiteContentRecord,
      { section: string; data: Record<string, unknown> }
    >({
      query: ({ section, data }) => ({
        url: `/admin/homepage/${section}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "SiteContent", id: "SINGLETON" }],
    }),

    getPortfolio: build.query<PortfolioRecord, void>({
      query: () => "/admin/portfolio",
      providesTags: [{ type: "Portfolio", id: "SINGLETON" }],
    }),
    savePortfolio: build.mutation<PortfolioRecord, PortfolioFormValues>({
      query: (body) => ({
        url: "/admin/portfolio",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Portfolio", id: "SINGLETON" }],
    }),
    savePortfolioSection: build.mutation<
      PortfolioRecord,
      { section: string; data: Record<string, unknown> | unknown[] }
    >({
      query: ({ section, data }) => ({
        url: `/admin/portfolio/${section}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Portfolio", id: "SINGLETON" }],
    }),
  }),
});

export const {
  useListUsersQuery,
  useCreateUserMutation,
  useSetUserRoleMutation,
  useListImagesQuery,
  useFinalizeImageMutation,
  useDeleteImageMutation,
  useListVideosQuery,
  useInvalidateVideosMutation,
  useDeleteVideoMutation,
  useGetSiteContentQuery,
  useSaveSiteContentMutation,
  useSaveSiteContentSectionMutation,
  useGetPortfolioQuery,
  useSavePortfolioMutation,
  useSavePortfolioSectionMutation,
} = api;
