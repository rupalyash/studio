import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarNav } from "@/components/sidebar-nav";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

function AppHeader() {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
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
                    <SheetTitle>SalesGPT</SheetTitle>
                </SheetHeader>
                <div className="p-2">
                 <SidebarNav />
                </div>
            </SheetContent>
          </Sheet>
        </div>
        <h1 className="text-lg font-semibold md:text-xl">SalesGPT</h1>
      </div>

      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="https://placehold.co/32x32" alt="@sales-rep" />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
             <h2 className="text-lg font-semibold text-sidebar-foreground">SalesGPT</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex flex-col !p-0 !m-0 !min-h-screen">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
