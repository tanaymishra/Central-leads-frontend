
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Magnet, Search, Loader2, Calendar, Globe, User, Mail, Phone, MoreHorizontal, Filter } from 'lucide-react';
import api from '@/lib/axios';
import { Lead } from '@/hooks/types';

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

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
        fetchLeads();
    }, []);

    return (
        <div className="p-8 pb-16 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1 tracking-tight">Lead Management</h1>
                    <p className="text-muted-foreground">Monitor and respond to incoming inquiries from all connected domains.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                    <Button>
                        Export CSV
                    </Button>
                </div>
            </div>

            <Card className="mb-8 border-border/50 bg-card/30">
                <CardContent className="p-4 flex items-center gap-4">
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
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${lead.status === 'new' ? 'bg-blue-500/10 text-blue-500' :
                                                lead.status === 'qualified' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    'bg-secondary text-muted-foreground'
                                            }`}>
                                            {lead.status}
                                        </span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            {lead.domain_name}
                                        </span>
                                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1 ml-auto">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground leading-none">{lead.first_name} {lead.last_name}</h3>
                                                <p className="text-sm text-muted-foreground mt-1 lowercase">{lead.source?.replace('_', ' ')}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5 border-l border-border/30 pl-6">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="w-3.5 h-3.5" />
                                                {lead.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="w-3.5 h-3.5" />
                                                {lead.phone || 'N/A'}
                                            </div>
                                        </div>

                                        <div className="flex-1 md:max-w-xs border-l border-border/30 pl-6">
                                            <p className="text-sm text-muted-foreground line-clamp-2 italic">
                                                "{lead.message || 'No message provided.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 md:py-0 bg-secondary/10 md:bg-transparent border-t md:border-t-0 md:border-l border-border/30 flex items-center gap-2">
                                    <Button variant="outline" size="sm">Action</Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {leads.length === 0 && (
                        <div className="text-center p-20 bg-secondary/20 rounded-2xl border border-dashed border-border/50">
                            <Magnet className="w-16 h-16 mx-auto mb-4 opacity-10" />
                            <p className="text-muted-foreground italic">No leads captured yet. Your centralized tracking is active.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
