
'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Loader2, Magnet, Globe, Clock, CheckCircle, ArrowUpRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
    trend?: string;
    color: string;
    delay?: number;
}

function MetricCard({ title, value, icon, description, trend, color, delay = 0 }: MetricCardProps) {
    return (
        <Card
            style={{ animationDelay: `${delay}ms` }}
            className="group relative overflow-hidden border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:bg-card hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 rounded-2xl"
        >
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${color.split(' ')[0]}`}></div>
            <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
                    <div className={`p-2.5 rounded-xl transition-transform duration-500 group-hover:scale-110 shadow-sm ${color}`}>
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4" }) : icon}
                    </div>
                </div>
                <div className="flex items-baseline gap-3">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight tabular-nums">{value}</h2>
                    {trend && (
                        <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" />
                            {trend}
                        </span>
                    )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-3 font-medium tracking-wide">{description}</p>
            </CardContent>
        </Card>
    );
}

interface Stats {
    totalLeads: number;
    newLeads24h: number;
    pendingLeads: number;
    totalDomains: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && user.role?.toLowerCase() === 'writer') {
            router.replace('/dashboard/blogs');
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await api.get('/stats/dashboard');
                setStats(res.data.data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing Command Center...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-10 pb-20 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                            Command Center
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            Live telemetry and analytics for your entire corporate ecosystem.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 md:flex-none rounded-xl h-10 border-border/50 hover:bg-secondary/50">System Logs</Button>
                        <Button className="flex-1 md:flex-none rounded-xl h-10 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Export Data</Button>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
                    <MetricCard
                        title="Total Leads"
                        value={stats?.totalLeads || 0}
                        icon={<Magnet />}
                        description="Lifetime captured prospects"
                        trend="12.5%"
                        color="bg-primary/10 text-primary"
                        delay={0}
                    />
                    <MetricCard
                        title="New (24h)"
                        value={stats?.newLeads24h || 0}
                        icon={<Clock />}
                        description="Inquiries since yesterday"
                        trend="Trending"
                        color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        delay={100}
                    />
                    <MetricCard
                        title="Pending"
                        value={stats?.pendingLeads || 0}
                        icon={<CheckCircle />}
                        description="Leads awaiting action"
                        color="bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        delay={200}
                    />
                    <MetricCard
                        title="Websites"
                        value={stats?.totalDomains || 0}
                        icon={<Globe />}
                        description="Active connected domains"
                        color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        delay={300}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <Card className="lg:col-span-2 border-border/40 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden hover:border-primary/20 transition-colors duration-500">
                        <CardHeader className="p-6 md:p-8 pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl md:text-2xl font-bold">Global Trajectory</CardTitle>
                                    <CardDescription className="text-sm mt-1">Consolidated volumetric metrics across distributed endpoints</CardDescription>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/50">
                                    <Activity className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[250px] md:h-[350px] p-0 flex flex-col justify-end relative">
                            {/* Abstract Chart Representation */}
                            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-primary/5 to-transparent"></div>
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <div className="text-center space-y-3">
                                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 animate-pulse">
                                        <BarChart3 className="w-8 h-8 text-primary/50" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground italic tracking-tight">Analytics engine initializing data streams...</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6 md:gap-8">
                        <Card className="border-border/40 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden flex-1">
                            <CardHeader className="p-6 pb-4">
                                <CardTitle className="text-xl font-bold border-b border-border/40 pb-4">System Health</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-2">
                                <div className="space-y-4">
                                    <HealthRow label="Core Backend API" status="online" delay={100} />
                                    <HealthRow label="PostgreSQL Database" status="online" delay={200} />
                                    <HealthRow label="Redis Cache Layer" status="online" delay={300} />
                                    <HealthRow label="Ingestion Worker" status="online" delay={400} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HealthRow({ label, status, delay = 0 }: { label: string, status: 'online' | 'offline', delay?: number }) {
    return (
        <div style={{ animationDelay: `${delay}ms` }} className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors border border-border/50 animate-in fade-in slide-in-from-right-4">
            <span className="text-sm font-medium text-foreground">{label}</span>
            <div className="flex items-center gap-2 bg-background/50 px-2.5 py-1 rounded-md shadow-sm border border-border/20">
                <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-destructive'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${status === 'online' ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                    {status}
                </span>
            </div>
        </div>
    );
}
