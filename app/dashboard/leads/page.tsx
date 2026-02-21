
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Magnet, Search, Loader2, Calendar, Globe, User, Mail, Phone, MoreHorizontal, Filter, Clock, FileText } from 'lucide-react';
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
        <div className="p-4 md:p-8 pb-16 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 tracking-tight">Lead Management</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Monitor and respond to incoming inquiries from all connected domains.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                    <Button size="sm" className="flex-1 md:flex-none">
                        Export CSV
                    </Button>
                </div>
            </div>

            <Card className="mb-6 md:mb-8 border-border/50 bg-card/30">
                <CardContent className="p-2 md:p-4 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            placeholder="Search by name, email or domain..."
                            className="w-full bg-transparent border-none focus:ring-0 pl-10 text-sm py-2"
                        />
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                </div>
            ) : (
                <div className="space-y-4">
                    {leads.map((lead) => (
                        <Card key={lead.id} className="group hover:border-primary/30 transition-all border-border/50 bg-card/50 overflow-hidden">
                            <div className="flex flex-col lg:flex-row lg:items-center">
                                <div className="p-4 md:p-6 flex-1">
                                    <div className="flex items-center gap-2 md:gap-3 mb-3">
                                        <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${lead.status === 'new' ? 'bg-blue-500/10 text-blue-500' :
                                            lead.status === 'qualified' ? 'bg-emerald-500/10 text-emerald-500' :
                                                'bg-secondary text-muted-foreground'
                                            }`}>
                                            {lead.status}
                                        </span>
                                        <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                            <Globe className="w-3 h-3 text-primary/50" />
                                            <span className="truncate max-w-[100px] md:max-w-none">{lead.domain_name}</span>
                                        </span>
                                        <span className="text-[9px] md:text-[10px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1 ml-auto">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                        <div className="flex items-center gap-3 min-w-[200px]">
                                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base md:text-lg font-bold text-foreground leading-none truncate">{lead.first_name} {lead.last_name}</h3>
                                                <p className="text-xs text-muted-foreground mt-1 lowercase truncate opacity-70">{lead.source?.replace('_', ' ')}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5 md:border-l border-border/30 md:pl-6">
                                            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground truncate">
                                                <Mail className="w-3.5 h-3.5" />
                                                {lead.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                                <Phone className="w-3.5 h-3.5" />
                                                {lead.phone || 'N/A'}
                                            </div>
                                        </div>

                                        <div className="flex-1 lg:max-w-xs md:border-l border-border/30 md:pl-6">
                                            <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 md:line-clamp-2 italic opacity-80 mb-2">
                                                "{lead.message || 'No message provided.'}"
                                            </p>

                                            {/* New Project Fields */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {lead.subject && (
                                                    <span className="text-[9px] bg-primary/5 text-primary px-1.5 py-0.5 rounded border border-primary/10 font-bold uppercase">
                                                        {lead.subject}
                                                    </span>
                                                )}
                                                {lead.deadline && (
                                                    <span className="text-[9px] bg-orange-500/5 text-orange-500 px-1.5 py-0.5 rounded border border-orange-500/10 font-bold uppercase flex items-center gap-1">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        {new Date(lead.deadline).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {lead.word_count && (
                                                    <span className="text-[9px] bg-blue-500/5 text-blue-500 px-1.5 py-0.5 rounded border border-blue-500/10 font-bold uppercase">
                                                        {lead.word_count} words
                                                    </span>
                                                )}
                                                {lead.files && lead.files.length > 0 && (
                                                    <span className="text-[9px] bg-emerald-500/5 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/10 font-bold uppercase flex items-center gap-1">
                                                        <FileText className="w-2.5 h-2.5" />
                                                        {lead.files.length} Attachments
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 bg-secondary/10 lg:bg-transparent border-t lg:border-t-0 lg:border-l border-border/30 flex items-center justify-between lg:justify-end gap-2">
                                    <Button variant="outline" size="sm" className="flex-1 lg:flex-none">Action</Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {leads.length === 0 && (
                        <div className="text-center p-12 md:p-20 bg-secondary/20 rounded-2xl border border-dashed border-border/50">
                            <Magnet className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-10" />
                            <p className="text-sm md:text-base text-muted-foreground italic max-w-xs mx-auto">No leads captured yet. Your centralized tracking is active.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
