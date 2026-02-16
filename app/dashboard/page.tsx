
'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, User as UserIcon, Loader2, Magnet, Globe, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import api from '@/lib/axios';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
    color: string;
}

function MetricCard({ title, value, icon, description, color }: MetricCardProps) {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:border-primary/20">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
                    <div className={`p-2 rounded-lg ${color}`}>
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4" }) : icon}
                    </div>
                </div>
                <div className="flex items-baseline justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 font-medium uppercase tracking-tight">{description}</p>
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

    useEffect(() => {
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
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 pb-16">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 tracking-tight">Main Dashboard</h1>
                        <p className="text-sm md:text-base text-muted-foreground">Real-time overview of your centralized ecosystem.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none">System Logs</Button>
                        <Button size="sm" className="flex-1 md:flex-none">Export Data</Button>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                    <MetricCard
                        title="Total Leads"
                        value={stats?.totalLeads || 0}
                        icon={<Magnet />}
                        description="Lifetime leads captured"
                        color="bg-primary/10 text-primary"
                    />
                    <MetricCard
                        title="New (24h)"
                        value={stats?.newLeads24h || 0}
                        icon={<Clock />}
                        description="Inquiries since yesterday"
                        color="bg-emerald-500/10 text-emerald-500"
                    />
                    <MetricCard
                        title="Pending"
                        value={stats?.pendingLeads || 0}
                        icon={<CheckCircle />}
                        description="Leads awaiting action"
                        color="bg-orange-500/10 text-orange-500"
                    />
                    <MetricCard
                        title="Websites"
                        value={stats?.totalDomains || 0}
                        icon={<Globe />}
                        description="Connected domains active"
                        color="bg-blue-500/10 text-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-border/50 bg-card/30">
                        <CardHeader className="p-4 md:p-6">
                            <CardTitle className="text-lg md:text-xl">Global Lead Activity</CardTitle>
                            <CardDescription className="text-xs md:text-sm">Consolidated metrics across all connected sites</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[200px] md:h-[300px] flex items-center justify-center border-t border-border/10">
                            <div className="text-muted-foreground flex flex-col items-center gap-2">
                                <BarChart3 className="w-10 h-10 opacity-10" />
                                <p className="text-xs md:text-sm font-medium opacity-30 italic text-center px-4">Real-time analytics engine starting up...</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/30">
                        <CardHeader className="p-4 md:p-6">
                            <CardTitle className="text-lg md:text-xl">System Health</CardTitle>
                            <CardDescription className="text-xs md:text-sm">Backend & Integration status</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6">
                            <div className="space-y-3 md:space-y-4">
                                <HealthRow label="Backend API" status="online" />
                                <HealthRow label="Database (PostgreSQL)" status="online" />
                                <HealthRow label="Rich Text Engine" status="online" />
                                <HealthRow label="Lead Deduplicator" status="online" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function HealthRow({ label, status }: { label: string, status: 'online' | 'offline' }) {
    return (
        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/50">
            <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-destructive'}`}></div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-foreground">{status}</span>
            </div>
        </div>
    );
}
