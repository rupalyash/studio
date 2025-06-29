
"use client"; // This needs to be a client component to use hooks

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarNav } from "@/components/sidebar-nav";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "../auth-provider";
import { Logo } from "@/components/logo";

function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border/20 bg-card/70 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 shrink-0">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
                <SheetHeader className="p-4 text-left">
                    <SheetTitle>Sales Buddy</SheetTitle>
                </SheetHeader>
                <div className="p-2">
                 <SidebarNav />
                </div>
            </SheetContent>
          </Sheet>
        </div>
        <h1 className="text-lg font-semibold md:text-xl">Sales Buddy</h1>
      </div>

      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={user?.photoURL ?? "https://placehold.co/32x32"} alt={user?.displayName ?? "User"} data-ai-hint="profile avatar" />
          <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

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
      <SidebarInset>
        <AppHeader />
        <div 
          className="flex-1 overflow-y-auto p-4 md:p-8 bg-auth-gradient animate-gradient-bg"
          style={{backgroundSize: '400% 400%'}}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
