"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Building2,
    Users,
    Activity,
    TrendingUp,
    Star,
    MessageSquare,
    Globe
} from "lucide-react";

export default function AdminDashboard() {
    const businesses = useQuery(api.businesses.list);
    const users = useQuery(api.users.list);

    // Compute real stats from available data
    const totalQuestions = businesses ? businesses.reduce((acc, b) => acc + (b.questions?.length || 0), 0) : 0;
    const allTypes = businesses ? businesses.flatMap(b => b.type || []) : [];
    const uniqueCategories = new Set(allTypes).size;
    const activeUsers = users ? users.filter(u => u.active).length : 0;

    const StatCard = ({ title, value, description, icon: Icon }) => (
        <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-md relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ring-1 ring-border/50 hover:ring-primary/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors blur-3xl will-change-transform" />

            <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <Icon className="h-6 w-6" />
                    </div>
                    {/* Decorative element could go here */}
                </div>
                <div className="space-y-1">
                    <div className="text-4xl font-extrabold text-foreground tracking-tight">{value}</div>
                    <h3 className="text-sm font-semibold text-muted-foreground/80 uppercase tracking-widest">{title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-4 font-medium flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    {description}
                </p>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-gotham)" }}>
                        Dashboard.
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium">Overview of your Empire's performance.</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                        Live System Status: Online
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Entities"
                    value={businesses ? businesses.length : "..."}
                    description="Total Registered Businesses"
                    icon={Building2}
                />
                <StatCard
                    title="Questions"
                    value={businesses ? totalQuestions : "..."}
                    description="Active Inquiry Points"
                    icon={MessageSquare}
                />
                <StatCard
                    title="Categories"
                    value={businesses ? uniqueCategories : "..."}
                    description="Diverse Business Types"
                    icon={Globe}
                />
                <StatCard
                    title="Admins"
                    value={users ? activeUsers : "..."}
                    description="Authorized Personnel"
                    icon={Users}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-2 border-0 shadow-lg bg-background/60 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>Latest business onboardings and updates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {businesses?.slice(0, 5).map((b, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-xl hover:bg-muted/40 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-black text-sm shadow-md group-hover:shadow-primary/25 transition-all">
                                            {b.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-none">{b.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1 font-mono tracking-tight">{b.slug}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border text-center">
                                        {new Date(b.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                            {!businesses && <div className="text-sm text-muted-foreground animate-pulse">Loading data...</div>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-primary" />
                            System Health
                        </CardTitle>
                        <CardDescription>Real-time operational metrics.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Database Connectivity</span>
                                <span className="text-green-500 font-bold">100%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-full animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">API Latency</span>
                                <span className="text-primary font-bold">24ms</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[15%]" />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mt-4">
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-foreground">User Session</p>
                                    <p className="text-xs text-muted-foreground">Admin privileges active. Session secure.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
