'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, LayoutDashboard, User, Users, Briefcase, BarChart3, Settings, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function DashboardPage() {
    const { user, logout, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        return null;
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 flex flex-col z-20 transition-all">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-foreground">CL System</span>
                </div>

                <div className="space-y-6 flex-1">
                    <div>
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 px-4">Menu</h3>
                        <nav className="space-y-1">
                            <SidebarLink icon={<LayoutDashboard />} label="Dashboard" active />
                            <SidebarLink icon={<Briefcase />} label="leads" />
                            <SidebarLink icon={<Users />} label="Teams" />
                            <SidebarLink icon={<BarChart3 />} label="Analytics" />
                        </nav>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 px-4">System</h3>
                        <nav className="space-y-1">
                            <SidebarLink icon={<Settings />} label="Settings" />
                        </nav>
                    </div>
                </div>

                <div className="pt-6 border-t border-border mt-auto">
                    <div className="flex items-center gap-3 px-2 mb-6">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center border border-border">
                            <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{user.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-4 h-11 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pl-64 flex flex-col">
                <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search leads, teams or files..."
                                className="bg-secondary/50 border-none shadow-none pl-10 focus-visible:ring-1 focus-visible:ring-primary/20 w-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                        </Button>
                        <div className="h-4 w-[1px] bg-border mx-2"></div>
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Current Estate</p>
                            <p className="text-sm font-medium">Standard Plan</p>
                        </div>
                    </div>
                </header>

                <div className="p-8 pb-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-1 tracking-tight">Main Dashboard</h1>
                                <p className="text-muted-foreground">Overview of your central leads and team performance.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Download Report</Button>
                                <Button size="sm">Create New Lead</Button>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <MetricCard title="Total Leads" value="1,284" change="+12.5%" trend="up" />
                            <MetricCard title="Active Projects" value="42" change="+3.2%" trend="up" />
                            <MetricCard title="Response Rate" value="98.2%" change="-1.1%" trend="down" />
                            <MetricCard title="Conversion" value="24.5%" change="+4.8%" trend="up" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2 border-border/50 bg-card/30">
                                <CardHeader>
                                    <CardTitle>Performance Overview</CardTitle>
                                    <CardDescription>Activity throughout the last 30 days</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px] flex items-center justify-center border-t border-border/10 bg-black/5 rounded-b-xl">
                                    <div className="text-muted-foreground flex flex-col items-center gap-2">
                                        <BarChart3 className="w-10 h-10 opacity-20" />
                                        <p className="text-sm font-medium opacity-50 italic">Chart data visualization loading...</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-card/30">
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest updates from your team</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <div className="w-8 h-8 rounded-full bg-secondary border border-border shrink-0 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">Kaushik added a new lead</p>
                                                    <p className="text-xs text-muted-foreground">2 mins ago</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Button
            variant={active ? "secondary" : "ghost"}
            className={`w-full justify-start gap-4 px-4 h-11 relative group ${active ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground'}`}
        >
            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}
            {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
            <span className="font-semibold">{label}</span>
            {!active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary/40 rounded-r-full transition-all group-hover:h-4" />
            )}
        </Button>
    );
}

function MetricCard({ title, value, change, trend }: { title: string, value: string, change: string, trend: 'up' | 'down' }) {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:border-primary/20">
            <CardContent className="p-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{title}</p>
                <div className="flex items-baseline justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                        {change}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
