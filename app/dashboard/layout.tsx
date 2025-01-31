import React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { WorkspaceChecker } from "@/components/workspace-checker";
import { UserProvider } from "@/providers/user-provider";

export default function DashboardLayout({ children }: any) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {" "}
        <WorkspaceChecker />
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
