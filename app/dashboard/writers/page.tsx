'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users, Shield, Loader2, Mail, Calendar, UserPlus, Fingerprint } from 'lucide-react';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Writer {
    id: number;
    email: string;
    name: string;
    role: string;
    created_at: string;
}

export default function WritersPage() {
    const [writers, setWriters] = useState<Writer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const fetchWriters = async () => {
        try {
            const res = await api.get('/users/writers');
            setWriters(res.data.data);
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
        fetchWriters();
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/users/writers', formData);
            setFormData({ name: '', email: '', password: '' });
            setShowAdd(false);
            fetchWriters();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to create writer');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-10 pb-20 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                        Team & Access
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        Provision and manage secure access for writers to distribute content across connected endpoints.
                    </p>
                </div>
                <Button size="lg" onClick={() => setShowAdd(!showAdd)} className="w-full md:w-auto rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 group">
                    <UserPlus className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                    Provision Access
                </Button>
            </div>

            {showAdd && (
                <Card className="mb-10 lg:mb-12 border-primary/30 bg-primary/5 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500 rounded-3xl shadow-xl shadow-primary/10 overflow-hidden relative">
                    <div className="absolute top-0 -left-10 p-40 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
                    <CardHeader className="p-6 md:p-8 pb-4">
                        <CardTitle className="text-xl md:text-2xl font-extrabold flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-background shadow-sm border border-border/50 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            New Team Member
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base font-medium opacity-80 pl-[52px]">Create an isolated account with limited permissions.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 pt-2">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                            <div className="space-y-2 md:col-span-3">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                                <Input
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="h-12 text-sm bg-background/60 border-border/50 rounded-xl focus-visible:ring-primary shadow-inner"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-4">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Work Email</label>
                                <Input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="h-12 text-sm bg-background/60 border-border/50 rounded-xl focus-visible:ring-primary shadow-inner"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-3">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Access Credential</label>
                                <div className="relative">
                                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="Secure password"
                                        value={formData.password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="h-12 text-sm pl-10 bg-background/60 border-border/50 rounded-xl focus-visible:ring-primary shadow-inner font-mono"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 mt-4 md:mt-0 flex h-[48px]">
                                <Button type="submit" disabled={isSubmitting} className="w-full h-full rounded-xl font-bold tracking-wide shadow-md hover:shadow-lg">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing team directory...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                    {writers.map((writer, idx) => (
                        <Card
                            key={writer.id}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="group flex flex-col h-full hover:border-primary/40 transition-all duration-500 border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:shadow-primary/5 animate-in slide-in-from-bottom-4 fade-in rounded-2xl"
                        >
                            <CardHeader className="p-6 md:p-8 pb-5 flex-1 relative">
                                <div className="absolute left-0 bottom-0 w-32 h-32 bg-secondary/50 rounded-tr-full -z-10 group-hover:bg-primary/5 transition-colors duration-500"></div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-secondary/80 to-background border border-border/50 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                                        <Users className="w-6 h-6 text-foreground/70 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                        {writer.role}
                                    </span>
                                </div>
                                <CardTitle className="text-xl md:text-2xl font-extrabold truncate mb-2">{writer.name}</CardTitle>
                                <CardDescription className="text-sm font-medium opacity-80 flex items-center gap-2 truncate bg-secondary/40 self-start px-2.5 py-1.5 rounded-lg mt-1">
                                    <Mail className="w-3.5 h-3.5 text-foreground/50" />
                                    {writer.email}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 pt-0 mt-auto border-t border-border/10">
                                <div className="flex items-center gap-2.5 text-[11px] font-medium text-muted-foreground bg-background/50 border border-border/40 p-3 rounded-xl mt-4">
                                    <Calendar className="w-4 h-4 text-primary/40" />
                                    Granted Access on {new Date(writer.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {writers.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-16 md:p-32 bg-gradient-to-b from-secondary/30 to-transparent rounded-3xl border border-dashed border-border/50 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-background rounded-2xl shadow-sm border border-border/50 flex items-center justify-center mb-6">
                                <Users className="w-10 h-10 text-primary/40" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-2">Empty Roster</h3>
                            <p className="text-base text-muted-foreground max-w-sm mb-8">No team members have been provisioned yet.</p>
                            <Button size="lg" onClick={() => setShowAdd(true)} className="rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all group">
                                <UserPlus className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                                Secure First Identity
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
