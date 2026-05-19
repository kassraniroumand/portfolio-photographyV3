import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Inter } from "next/font/google";
import { auth } from "@/lib/auth";
import { ReduxProvider } from "@/lib/store/provider";
import { ImageModal } from "@/components/image-modal";
import { ImageGalleryModal } from "@/components/image-gallery-modal";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

const dashboardFont = Inter({
  subsets: ["latin"],
  variable: "--font-dashboard",
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <ReduxProvider>
      <SidebarProvider
        className={`${dashboardFont.variable} ${dashboardFont.className} min-h-0 flex-1`}
      >
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col px-8 py-10">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <ImageGalleryModal />
      <ImageModal />
    </ReduxProvider>
  );
}
