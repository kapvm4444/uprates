"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import * as React from "react";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [adminColor, setAdminColor] = React.useState("zinc");

    React.useEffect(() => {
        const stored = localStorage.getItem("admin_theme_color");
        if (stored) setAdminColor(stored);
    }, []);

    const handleColorChange = (color) => {
        setAdminColor(color);
        localStorage.setItem("admin_theme_color", color);
        // Dispatch custom event for layout to catch
        window.dispatchEvent(new Event("admin-theme-change"));
    };

    const colors = [
        { name: "zinc", class: "bg-zinc-600" },
        { name: "red", class: "bg-red-600" },
        { name: "blue", class: "bg-blue-600" },
        { name: "green", class: "bg-green-600" },
        { name: "orange", class: "bg-orange-600" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            {/* Appearance Section with Floating Title Style */}
            <div className="relative rounded-xl border border-input p-6 pt-8 shadow-sm">
                <span className="absolute -top-3 left-4 bg-background px-2 text-lg font-semibold text-foreground">
                    Appearance
                </span>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-base">Theme Mode</Label>
                            <p className="text-sm text-muted-foreground">Toggle between Dark and Light mode.</p>
                        </div>
                        <ModeToggle />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-base">Admin Panel Accent Color</Label>
                        <Select value={adminColor} onValueChange={handleColorChange}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select a color" />
                            </SelectTrigger>
                            <SelectContent>
                                {colors.map((c) => (
                                    <SelectItem key={c.name} value={c.name}>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-3 w-3 rounded-full ${c.class}`} />
                                            <span className="capitalize">{c.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">This color will be applied to buttons and active elements in the admin panel.</p>
                    </div>
                </div>
            </div>

            {/* System Config Section */}
            <div className="relative rounded-xl border border-input p-6 pt-8 shadow-sm">
                <span className="absolute -top-3 left-4 bg-background px-2 text-lg font-semibold text-foreground">
                    System Configuration
                </span>
                <div className="space-y-4">
                    <div className="relative">
                        <Input
                            id="openai-key"
                            type="password"
                            className="peer h-10 border-2 border-input bg-background px-3 pt-2 placeholder-transparent focus:border-primary focus:outline-none"
                            placeholder="API Key"
                            disabled
                        />
                        <Label
                            htmlFor="openai-key"
                            className="absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary"
                        >
                            OpenAI API Key (Server-Side)
                        </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Managed locally via <code>.env.local</code> or in Convex Dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
}
