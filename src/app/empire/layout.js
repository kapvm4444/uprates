"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Building2,
    Users,
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { resolvedTheme } = useTheme();
    const [authorized, setAuthorized] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Check if we are on a public admin page
    const isPublicAdminPage = pathname === "/empire/login" || pathname === "/empire/who-are-you";

    // Breadcrumbs generation
    const generateBreadcrumbs = () => {
        const paths = pathname.split("/").filter(p => p);
        // paths[0] is 'empire'
        return paths.map((path, index) => {
            const href = "/" + paths.slice(0, index + 1).join("/");
            const isLast = index === paths.length - 1;
            const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
            return { href, label, isLast };
        });
    };
    const breadcrumbs = generateBreadcrumbs();

    useEffect(() => {
        if (isPublicAdminPage) return;

        const access = sessionStorage.getItem("empire_access");
        if (access !== "granted") {
            router.push("/empire/who-are-you");
            return;
        }

        const user = sessionStorage.getItem("empire_user");
        if (!user) {
            router.push("/empire/login");
        } else {
            setAuthorized(true);
        }
    }, [pathname, router, isPublicAdminPage]);

    const [adminTheme, setAdminTheme] = useState("zinc");

    // Theme application logic
    useEffect(() => {
        const updateTheme = () => {
            const color = localStorage.getItem("admin_theme_color") || "zinc";
            setAdminTheme(color);
        };

        // Initial load
        updateTheme();

        // Listen for changes
        window.addEventListener("admin-theme-change", updateTheme);
        return () => window.removeEventListener("admin-theme-change", updateTheme);
    }, []);

    const themeColors = {
        zinc: { light: "0.205 0 0", dark: "0.985 0 0" },
        red: { light: "0.577 0.245 27.325", dark: "0.627 0.265 29.234" },
        blue: { light: "0.546 0.245 262.88", dark: "0.623 0.214 259.815" },
        green: { light: "0.581 0.205 141.593", dark: "0.627 0.194 149.214" },
        orange: { light: "0.609 0.200 50.000", dark: "0.705 0.213 47.604" },
    };

    const selectedColor = themeColors[adminTheme] || themeColors.zinc;
    const primaryValue = resolvedTheme === "dark" ? selectedColor.dark : selectedColor.light;
    const ringValue = primaryValue;

    if (isPublicAdminPage) return <>{children}</>;
    if (!authorized) return null;

    const navItems = [
        { href: "/empire", label: "Analytics", icon: LayoutDashboard },
        { href: "/empire/businesses", label: "Businesses", icon: Building2 },
        { href: "/empire/users", label: "Users", icon: Users },
        { href: "/empire/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div
            className="flex h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden relative"
            style={{
                fontFamily: "var(--font-proxima)",
                "--primary": `oklch(${primaryValue})`,
                "--ring": `oklch(${ringValue})`,
            }}
        >
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Sidebar */}
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


            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">

                {/* Glassmorphism Topbar */}
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/40 px-6 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 shrink-0 justify-between">
                    <nav className="flex items-center text-sm text-muted-foreground overflow-hidden" style={{ fontFamily: "var(--font-lato)" }}>
                        {breadcrumbs.map((crumb, i) => (
                            <div key={crumb.href} className="flex items-center whitespace-nowrap">
                                {i > 0 && <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0 text-muted-foreground/50" />}
                                {crumb.isLast ? (
                                    <span className="font-semibold text-foreground truncate">{crumb.label}</span>
                                ) : (
                                    <Link href={crumb.href} className="hover:text-foreground transition-colors truncate">
                                        {crumb.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2 shrink-0">
                        <ModeToggle />
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 p-6 overflow-y-auto no-scrollbar scroll-smooth">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>

            <Toaster
                position="bottom-right"
                toastOptions={{
                    className: 'shadow-2xl font-medium tracking-wide',
                    style: {
                        borderRadius: '12px',
                        padding: '16px',
                        background: `oklch(${primaryValue})`,
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
                    },
                    success: {
                        iconTheme: {
                            primary: 'white',
                            secondary: `oklch(${primaryValue})`,
                        },
                    },
                    error: {
                        style: {
                            background: `oklch(${themeColors.red[resolvedTheme === 'dark' ? 'dark' : 'light']})`,
                            color: 'white',
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: `oklch(${themeColors.red[resolvedTheme === 'dark' ? 'dark' : 'light']})`,
                        },
                    },
                }}
            />
        </div>
    );
}
