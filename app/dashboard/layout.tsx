
'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, LayoutDashboard, User, Users, Briefcase, BarChart3, Settings, Bell, Search, Globe, FileText, Magnet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
        <div className="min-h-screen bg-background text-foreground font-sans flex translate-z-0">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 flex flex-col z-20 transition-all">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-foreground">CL System</span>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div>
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 px-4">Menu</h3>
                        <nav className="space-y-1">
                            <SidebarLink icon={<LayoutDashboard />} label="Dashboard" href="/dashboard" />
                            <SidebarLink icon={<Magnet />} label="Leads" href="/dashboard/leads" />
                            <SidebarLink icon={<Globe />} label="Domains" href="/dashboard/domains" />
                            <SidebarLink icon={<FileText />} label="Blogs" href="/dashboard/blogs" />
                            <SidebarLink icon={<BarChart3 />} label="Analytics" href="/dashboard/analytics" />
                        </nav>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 px-4">Platform</h3>
                        <nav className="space-y-1">
                            <SidebarLink icon={<Settings />} label="Settings" href="/dashboard/settings" />
                            <SidebarLink icon={<Users />} label="Teams" href="/dashboard/teams" />
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
            <div className="flex-1 pl-64 flex flex-col min-h-screen">
                <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search leads, domains or blogs..."
                                className="bg-secondary/50 border-none shadow-none pl-10 focus-visible:ring-1 focus-visible:ring-primary/20 w-full rounded-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground rounded-full">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                        </Button>
                        <div className="h-4 w-[1px] bg-border mx-2"></div>
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Account Type</p>
                            <p className="text-sm font-semibold tracking-tight">Enterprise</p>
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    {children}
                </main>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
        }
      `}</style>
        </div>
    );
}

function SidebarLink({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
    const pathname = usePathname();
    const active = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));

    return (
        <Link href={href} className="block w-full">
            <Button
                variant={active ? "secondary" : "ghost"}
                className={`w-full justify-start gap-4 px-4 h-11 relative group transition-all duration-200 ${active ? 'bg-primary/5 text-primary shadow-sm' : 'text-muted-foreground hover:bg-secondary/50'}`}
            >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-lg shadow-[2px_0_8px_rgba(0,0,0,0.1)]" />}
                <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:translate-x-0.5'}`}>
                    {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
                </div>
                <span className={`text-sm tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </Button>
        </Link>
    );
}
