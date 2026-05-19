"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  FolderKanban,
  Images,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAppDispatch } from "@/lib/store/hooks";
import { openGallery } from "@/lib/store/slices/image-gallery-slice";
import { signOut, useSession } from "@/lib/auth-client";

const navItems = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Home homepage", href: "/admin/homepage", icon: LayoutDashboard },
  { title: "Portfolio", href: "/admin/portfolio", icon: FolderKanban },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Images", href: "/admin/images", icon: Images }
];

export function AppSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <span className="text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Dashboard
          </span>
          <SidebarTrigger className="-mr-1" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Open gallery"
                  onClick={() => dispatch(openGallery())}
                >
                  <Images />
                  <span>Open gallery</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-0.5 px-2 py-1.5 group-data-[collapsible=icon]:hidden">
              <span className="text-xs font-medium text-foreground">
                {isPending
                  ? "…"
                  : session?.user.name || session?.user.email || "Signed out"}
              </span>
              {session?.user.email && session.user.name && (
                <span className="truncate text-xs text-muted-foreground">
                  {session.user.email}
                </span>
              )}
            </div>
          </SidebarMenuItem>
          {session && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sign out"
                onClick={handleSignOut}
              >
                <LogOut />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
