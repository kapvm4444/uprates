"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Building2,
    Users,
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";

export default function Sidebar({ isCollapsed, setIsCollapsed, pathname, router }) {
    const navItems = [
        { href: "/empire", label: "Analytics", icon: LayoutDashboard },
        { href: "/empire/businesses", label: "Businesses", icon: Building2 },
        { href: "/empire/users", label: "Users", icon: Users },
        { href: "/empire/settings", label: "Settings", icon: Settings },
    ];

    return (
        <aside
            className={cn(
                "flex flex-col border-r bg-background/80 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 z-10 overflow-x-hidden",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex h-16 items-center justify-between px-4 border-b shrink-0 bg-background/50">
                {!isCollapsed && <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-gotham)" }}>Empire</span>}
                <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className={cn("ml-auto h-8 w-8", isCollapsed && "mx-auto")}>
                    {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
            </div>

            <nav className="flex-1 space-y-2 p-2 overflow-y-auto no-scrollbar overflow-x-hidden" style={{ fontFamily: "var(--font-lato)" }}>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center rounded-lg text-sm font-medium transition-all group relative duration-300",
                            !isCollapsed ? "w-full px-3 py-2 space-x-3" : "w-10 h-10 justify-center p-0 mx-auto",
                            pathname === item.href
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "hover:bg-accent/50 hover:text-accent-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            <div className="border-t p-2 shrink-0 bg-background/50 flex justify-center">
                <Button
                    variant="ghost"
                    className={cn(
                        "justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20",
                        isCollapsed ? "w-10 h-10 p-0 justify-center" : "w-full px-4"
                    )}
                    onClick={() => {
                        sessionStorage.removeItem("empire_user");
                        router.push("/empire/login");
                    }}
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="ml-2 truncate">Logout</span>}
                </Button>
            </div>
        </aside>
    );
}
