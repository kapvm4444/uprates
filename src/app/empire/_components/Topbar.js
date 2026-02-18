"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Topbar({ breadcrumbs }) {
    return (
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
    );
}
