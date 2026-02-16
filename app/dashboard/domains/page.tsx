
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Globe, ExternalLink, Shield, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { Domain } from '@/hooks/types';

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({ name: '', url: '', api_key: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        fetchDomains();
    }, []);

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
        <div className="p-8 pb-16 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1 tracking-tight">Domains & Websites</h1>
                    <p className="text-muted-foreground">Manage centralized websites for blog publishing and lead tracking.</p>
                </div>
                <Button onClick={() => setShowAdd(!showAdd)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Website
                </Button>
            </div>

            {showAdd && (
                <Card className="mb-8 border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>Add New Domain</CardTitle>
                        <CardDescription>Configure a new website for centralized management.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Website Name (e.g. My Blog)"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    placeholder="URL (https://example.com)"
                                    value={formData.url}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, url: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="API Key (Optional)"
                                    value={formData.api_key}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, api_key: e.target.value })}
                                    className="flex-1"
                                />
                                <Button type="submit" disabled={isSubmitting}>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {domains.map((domain) => (
                        <Card key={domain.id} className="group hover:border-primary/30 transition-all border-border/50 bg-card/50">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-primary" />
                                    </div>
                                    <Button variant="ghost" size="icon" asChild>
                                        <a href={domain.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                        </a>
                                    </Button>
                                </div>
                                <CardTitle className="text-xl">{domain.name}</CardTitle>
                                <CardDescription className="truncate">{domain.url}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/50 p-2 rounded-md">
                                    <Shield className="w-3 h-3" />
                                    {domain.api_key ? 'API Key Configured' : 'No API Key Set'}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {domains.length === 0 && (
                        <div className="col-span-full text-center p-12 bg-secondary/20 rounded-2xl border border-dashed border-border/50">
                            <Globe className="w-12 h-12 mx-auto mb-4 opacity-10" />
                            <p className="text-muted-foreground italic">No domains added yet. Click "Add Website" to begin.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
