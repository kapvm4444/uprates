"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import Sidebar from "./_components/Sidebar";
import Topbar from "./_components/Topbar";

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
    // Avoid flash of unauthorized content if checking
    // if (!authorized) return null; // Logic maintained

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

            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} pathname={pathname} router={router} />

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <Topbar breadcrumbs={breadcrumbs} />

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
