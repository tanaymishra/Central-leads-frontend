
'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
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
                                            <p className="text-xs text-muted-foreground">{i * 2} mins ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
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
