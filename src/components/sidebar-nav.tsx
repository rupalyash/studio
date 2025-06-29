"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChartBig, Globe, LayoutDashboard, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/sales-analysis",
    label: "Sales Analysis",
    icon: BarChartBig,
  },
  {
    href: "/market-insights",
    label: "Market Insights",
    icon: Globe,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.href}>
            <Link href={link.href}>
              <SidebarMenuButton
                isActive={pathname.startsWith(link.href)}
                tooltip={link.label}
              >
                <link.icon />
                <span>{link.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarMenu className="mt-auto">
        <SidebarMenuItem>
          <Link href="/auth/sign-out">
            <SidebarMenuButton
              isActive={pathname === "/auth/sign-out"}
              tooltip="Sign Out"
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
