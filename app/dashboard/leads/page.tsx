
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Magnet, Search, Loader2, Calendar, Globe, User, Mail, Phone, MoreHorizontal, Filter, Clock, FileText, Download } from 'lucide-react';
import api from '@/lib/axios';
import { Lead } from '@/hooks/types';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    const fetchLeads = async () => {
        try {
            const res = await api.get('/leads');
            setLeads(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role?.toLowerCase() === 'writer') {
            router.replace('/dashboard/blogs');
            return;
        }
        fetchLeads();
    }, [user, router]);

    return (
        <div className="p-4 md:p-8 lg:p-10 pb-20 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                        Lead Intelligence
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        Monitor, filter, and respond to incoming global prospects automatically.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" size="lg" className="flex-1 md:flex-none border-border/50 hover:bg-secondary/50 rounded-xl">
                        <Filter className="w-4 h-4 mr-2 text-primary" />
                        Filters
                    </Button>
                    <Button size="lg" className="flex-1 md:flex-none rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="mb-8 p-1.5 bg-secondary/30 backdrop-blur-md rounded-2xl border border-border/50 shadow-sm flex items-center gap-4 relative z-10 transition-colors focus-within:bg-secondary/50">
                <Search className="ml-4 w-5 h-5 text-muted-foreground" />
                <input
                    placeholder="Search by name, email, or domain context..."
                    className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 outline-none transition-all placeholder:text-muted-foreground/70 font-medium"
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Scanning telemetry...</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {leads.map((lead, idx) => (
                        <Card
                            key={lead.id}
                            style={{ animationDelay: `${idx * 50}ms` }}
                            className="group hover:border-primary/40 transition-all duration-500 border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 rounded-2xl"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-stretch relative">
                                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/50 to-transparent group-hover:from-primary transition-colors duration-500"></div>
                                <div className="p-6 md:p-8 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-widest border border-transparent shadow-sm flex items-center gap-1.5 ${lead.status === 'new' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                                                    lead.status === 'qualified' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                                        'bg-secondary text-muted-foreground border-border/50'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'new' ? 'bg-blue-500' : lead.status === 'qualified' ? 'bg-emerald-500' : 'bg-muted-foreground'}`}></div>
                                                {lead.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-md">
                                                <Globe className="w-3 h-3 text-primary/60" />
                                                <span className="truncate max-w-[120px] md:max-w-[200px]">{lead.domain_name}</span>
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 bg-background/50 px-2.5 py-1 rounded-md border border-border/40">
                                            <Calendar className="w-3 h-3 text-primary/40" />
                                            {new Date(lead.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                                        <div className="md:col-span-4 lg:col-span-3 flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex flex-shrink-0 items-center justify-center text-muted-foreground border border-border/50 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight truncate mb-1">{lead.first_name} {lead.last_name}</h3>
                                                <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider truncate">{lead.source?.replace('_', ' ')}</p>
                                            </div>
                                        </div>

                                        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-2.5 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6 lg:pl-8">
                                            <div className="flex items-center gap-2.5 text-sm text-muted-foreground truncate hover:text-foreground transition-colors cursor-pointer group/contact">
                                                <div className="w-6 h-6 rounded-md bg-secondary/80 flex items-center justify-center group-hover/contact:bg-primary/20 transition-colors">
                                                    <Mail className="w-3 h-3 group-hover/contact:text-primary transition-colors" />
                                                </div>
                                                <span className="truncate">{lead.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-sm text-muted-foreground truncate hover:text-foreground transition-colors cursor-pointer group/contact">
                                                <div className="w-6 h-6 rounded-md bg-secondary/80 flex items-center justify-center group-hover/contact:bg-primary/20 transition-colors">
                                                    <Phone className="w-3 h-3 group-hover/contact:text-primary transition-colors" />
                                                </div>
                                                {lead.phone || 'N/A'}
                                            </div>
                                        </div>

                                        <div className="md:col-span-4 lg:col-span-6 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6 lg:pl-8">
                                            <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3 leading-relaxed opacity-90 mb-4 bg-background/30 p-3 rounded-xl border border-border/30 shadow-inner block">
                                                "{lead.message || 'No specific message context provided by the prospect.'}"
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {lead.subject && (
                                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md font-bold uppercase tracking-wider border border-primary/20 shadow-sm">
                                                        {lead.subject}
                                                    </span>
                                                )}
                                                {lead.deadline && (
                                                    <span className="text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md font-bold uppercase flex items-center gap-1.5 border border-orange-500/20 shadow-sm">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(lead.deadline).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {lead.word_count && (
                                                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md font-bold uppercase border border-blue-500/20 shadow-sm">
                                                        {lead.word_count} words
                                                    </span>
                                                )}
                                                {lead.files && lead.files.length > 0 && (
                                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md font-bold uppercase flex items-center gap-1.5 border border-emerald-500/20 shadow-sm">
                                                        <FileText className="w-3 h-3" />
                                                        {lead.files.length} Attachments
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 lg:p-6 lg:w-32 bg-gradient-to-r lg:bg-gradient-to-b from-secondary/30 to-transparent border-t lg:border-t-0 lg:border-l border-border/30 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-3">
                                    <Button variant="default" size="sm" className="flex-1 lg:flex-none lg:w-full rounded-xl shadow-md">Reply</Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-background border border-transparent hover:border-border/50 transition-all opacity-100 lg:opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {leads.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-16 md:p-32 bg-gradient-to-b from-secondary/30 to-transparent rounded-3xl border border-dashed border-border/50 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-background rounded-2xl shadow-sm border border-border/50 flex items-center justify-center mb-6">
                                <Magnet className="w-10 h-10 text-primary/40" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-2">Awaiting inbound telemetry</h3>
                            <p className="text-base text-muted-foreground max-w-sm mb-0">Your centralized tracking is active, but no leads have been captured yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
