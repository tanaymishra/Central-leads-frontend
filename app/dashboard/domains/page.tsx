
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Globe, ExternalLink, Shield, Loader2, Fingerprint, Activity } from 'lucide-react';
import api from '@/lib/axios';
import { Domain } from '@/hooks/types';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({ name: '', url: '', api_key: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const fetchDomains = async () => {
        try {
            const res = await api.get('/domains');
            setDomains(res.data.data);
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
        fetchDomains();
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/domains', formData);
            setFormData({ name: '', url: '', api_key: '' });
            setShowAdd(false);
            fetchDomains();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-10 pb-20 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                        Connected Endpoints
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        Centrally provision and orchestrate domains for seamless data synchronization.
                    </p>
                </div>
                <Button size="lg" onClick={() => setShowAdd(!showAdd)} className="w-full md:w-auto rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 group">
                    <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
                    Provision Endpoint
                </Button>
            </div>

            {showAdd && (
                <Card className="mb-10 lg:mb-12 border-primary/30 bg-primary/5 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500 rounded-3xl shadow-xl shadow-primary/10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[80px] -z-10"></div>
                    <CardHeader className="p-6 md:p-8 pb-4">
                        <CardTitle className="text-xl md:text-2xl font-extrabold flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-background shadow-sm border border-border/50 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-primary" />
                            </div>
                            Initialize Connection
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base font-medium opacity-80 pl-[52px]">Integrate a new website via strict API parameters.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 pt-2">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                            <div className="space-y-2 md:col-span-3">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Identifier</label>
                                <Input
                                    placeholder="e.g. Primary Blog"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="h-12 text-sm bg-background/60 border-border/50 rounded-xl focus-visible:ring-primary shadow-inner"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-4">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Target URL</label>
                                <Input
                                    placeholder="https://example.com"
                                    value={formData.url}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, url: e.target.value })}
                                    required
                                    className="h-12 text-sm bg-background/60 border-border/50 rounded-xl focus-visible:ring-primary shadow-inner"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-3">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Security Token</label>
                                <div className="relative">
                                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="sk_live_..."
                                        value={formData.api_key}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, api_key: e.target.value })}
                                        className="h-12 text-sm pl-10 bg-background/60 border-border/50 rounded-xl focus-visible:ring-primary shadow-inner font-mono text-[13px]"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 mt-4 md:mt-0">
                                <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl font-bold tracking-wide shadow-md hover:shadow-lg">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="flex flex-col justify-center items-center p-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Requesting network registry...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                    {domains.map((domain, idx) => (
                        <Card
                            key={domain.id}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="group flex flex-col h-full hover:border-primary/40 transition-all duration-500 border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:shadow-primary/5 animate-in slide-in-from-bottom-4 fade-in rounded-2xl"
                        >
                            <CardHeader className="p-6 md:p-8 pb-5 flex-1 relative">
                                <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full rounded-tr-xl -z-10 group-hover:bg-primary/10 transition-colors"></div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                                        <Globe className="w-6 h-6 text-primary" />
                                    </div>
                                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all shadow-sm" asChild>
                                        <a href={domain.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </Button>
                                </div>
                                <CardTitle className="text-xl md:text-2xl font-extrabold truncate mb-2">{domain.name}</CardTitle>
                                <CardDescription className="text-sm font-medium opacity-80 flex items-center gap-1.5 truncate bg-secondary/40 self-start px-2.5 py-1 rounded-md">
                                    <Globe className="w-3 h-3 text-foreground/50" />
                                    {domain.url}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 pt-0 mt-auto border-t border-border/10">
                                <div className={`flex items-center justify-between mt-4 px-3.5 py-2.5 rounded-xl border transition-colors ${domain.api_key ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-orange-500/5 border-orange-500/20 text-orange-600 dark:text-orange-400'}`}>
                                    <div className="flex items-center gap-2">
                                        <Shield className={`w-4 h-4 ${domain.api_key ? '' : 'opacity-70'}`} />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">{domain.api_key ? 'Secured Entry' : 'Open Entry'}</span>
                                    </div>
                                    <div className={`w-1.5 h-1.5 rounded-full ${domain.api_key ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-orange-500'}`}></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {domains.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-16 md:p-32 bg-gradient-to-b from-secondary/30 to-transparent rounded-3xl border border-dashed border-border/50 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-background rounded-2xl shadow-sm border border-border/50 flex items-center justify-center mb-6">
                                <Globe className="w-10 h-10 text-primary/40" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-2">Network Isolated</h3>
                            <p className="text-base text-muted-foreground max-w-sm mb-8">You haven't integrated any external touchpoints yet.</p>
                            <Button size="lg" onClick={() => setShowAdd(true)} className="rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all group">
                                <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
                                Initiate Connection
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
