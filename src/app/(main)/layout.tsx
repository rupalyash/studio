
"use client"; // This needs to be a client component to use hooks

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";
import { Logo } from "@/components/logo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader>
           <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset 
        className="bg-auth-gradient animate-gradient-bg"
        style={{backgroundSize: '400% 400%'}}
      >
        <div className="absolute inset-0 z-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative z-10 flex h-full flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b border-border/20 bg-transparent px-4 backdrop-blur-sm md:hidden">
            <SidebarTrigger />
          </header>
          <div 
            className="flex-1 overflow-y-auto p-4 md:p-8"
          >
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
