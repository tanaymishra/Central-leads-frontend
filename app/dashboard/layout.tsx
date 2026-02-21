'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, LayoutDashboard, User, Users, Briefcase, BarChart3, Settings, Bell, Search, Globe, FileText, Magnet, Menu, X } from 'lucide-react';
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col md:flex-row relative selection:bg-primary/20">
            {/* Premium Background Elements */}
            <div className="fixed inset-0 z-[-1] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="fixed top-[-10%] left-[-10%] z-[-1] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]"></div>

            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`fixed md:sticky left-0 top-0 h-full w-[280px] bg-card/40 backdrop-blur-xl border-r border-border/50 p-6 flex flex-col z-40 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 border border-primary/20">
                            <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-foreground">CL System</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-8 w-8 rounded-full bg-secondary/50 hover:bg-secondary"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div>
                        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-4 px-4 bg-clip-text text-transparent bg-gradient-to-r from-muted-foreground to-muted-foreground/50">Menu</h3>
                        <nav className="space-y-1.5">
                            {user?.role?.toLowerCase() !== 'writer' && (
                                <>
                                    <SidebarLink icon={<LayoutDashboard />} label="Overview" href="/dashboard" onClick={() => setIsSidebarOpen(false)} />
                                    <SidebarLink icon={<Magnet />} label="Leads" href="/dashboard/leads" onClick={() => setIsSidebarOpen(false)} />
                                    <SidebarLink icon={<Globe />} label="Websites" href="/dashboard/domains" onClick={() => setIsSidebarOpen(false)} />
                                    <SidebarLink icon={<Users />} label="Team" href="/dashboard/writers" onClick={() => setIsSidebarOpen(false)} />
                                </>
                            )}
                            <SidebarLink icon={<FileText />} label="Content" href="/dashboard/blogs" onClick={() => setIsSidebarOpen(false)} />
                        </nav>
                    </div>
                </div>

                <div className="pt-6 border-t border-border/50 mt-auto">
                    <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                        <div className="w-9 h-9 bg-background rounded-full flex items-center justify-center border border-border/50 shadow-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{user.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-4 h-10 rounded-xl transition-all font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0 md:max-w-[calc(100vw-280px)]">
                <header className="h-16 md:h-20 border-b border-border/40 bg-background/40 backdrop-blur-xl sticky top-0 px-4 md:px-8 flex items-center justify-between z-20 transition-all">
                    <div className="flex items-center gap-3 flex-1 max-w-xl">
                        <Button
                            variant="outline"
                            size="icon"
                            className="md:hidden h-9 w-9 rounded-xl border-border/50"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-4 h-4" />
                        </Button>
                        <div className="relative w-full hidden sm:block group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                placeholder={user?.role?.toLowerCase() === 'writer' ? "Search articles..." : "Search leads, domains, or articles..."}
                                className="bg-secondary/40 border-border/50 h-10 pl-10 focus-visible:ring-1 focus-visible:ring-primary/20 w-full rounded-full transition-all hover:bg-secondary/60 focus-visible:bg-background shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 ml-4">
                        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-sm animate-pulse"></span>
                        </Button>
                        <div className="h-6 w-[1px] bg-border/50 mx-1 hidden sm:block"></div>
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Workspace</p>
                            <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                                <span className="text-sm font-semibold tracking-tight">Enterprise</span>
                                <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
}

function SidebarLink({ icon, label, href, onClick }: { icon: React.ReactNode, label: string, href: string, onClick?: () => void }) {
    const pathname = usePathname();
    const active = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));

    return (
        <Link href={href} className="block w-full" onClick={onClick}>
            <Button
                variant="ghost"
                className={`w-full justify-start gap-3.5 px-4 h-11 relative group transition-all duration-300 rounded-xl overflow-hidden ${active ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
                {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50" />
                )}
                <div className={`transition-transform duration-300 relative z-10 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4" }) : icon}
                </div>
                <span className={`text-sm tracking-tight relative z-10 ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
            </Button>
        </Link>
    );
}
