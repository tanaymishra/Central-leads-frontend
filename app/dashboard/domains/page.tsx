
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Globe, ExternalLink, Shield, Loader2 } from 'lucide-react';
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
        <div className="p-4 md:p-8 pb-16 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 tracking-tight">Domains & Websites</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Manage centralized websites for blog publishing and lead tracking.</p>
                </div>
                <Button size="sm" onClick={() => setShowAdd(!showAdd)} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Website
                </Button>
            </div>

            {showAdd && (
                <Card className="mb-8 border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-lg md:text-xl">Add New Domain</CardTitle>
                        <CardDescription className="text-xs md:text-sm">Configure a new website for centralized management.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Website Name (e.g. My Blog)"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    placeholder="URL (https://example.com)"
                                    value={formData.url}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, url: e.target.value })}
                                    required
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="API Key (Optional)"
                                    value={formData.api_key}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, api_key: e.target.value })}
                                    className="flex-1 h-10 text-sm"
                                />
                                <Button type="submit" disabled={isSubmitting} className="h-10">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {domains.map((domain) => (
                        <Card key={domain.id} className="group hover:border-primary/30 transition-all border-border/50 bg-card/50">
                            <CardHeader className="p-4 md:p-6 pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-primary" />
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                        <a href={domain.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                        </a>
                                    </Button>
                                </div>
                                <CardTitle className="text-lg md:text-xl truncate">{domain.name}</CardTitle>
                                <CardDescription className="text-xs md:text-sm truncate opacity-70">{domain.url}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                                <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium text-muted-foreground bg-secondary/50 p-2 rounded-md">
                                    <Shield className="w-3 h-3 text-primary/40" />
                                    {domain.api_key ? 'API Key Configured' : 'No API Key Set'}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {domains.length === 0 && (
                        <div className="col-span-full text-center p-12 md:p-20 bg-secondary/20 rounded-2xl border border-dashed border-border/50">
                            <Globe className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-10" />
                            <p className="text-sm md:text-base text-muted-foreground italic max-w-xs mx-auto">No domains added yet. Click "Add Website" to begin.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
