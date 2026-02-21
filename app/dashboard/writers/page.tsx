'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users, Shield, Loader2, Mail, Calendar } from 'lucide-react';
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
        <div className="p-4 md:p-8 pb-16 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 tracking-tight">Writers Management</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Manage writer accounts for publishing blogs.</p>
                </div>
                <Button size="sm" onClick={() => setShowAdd(!showAdd)} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Writer
                </Button>
            </div>

            {showAdd && (
                <Card className="mb-8 border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-lg md:text-xl">Add New Writer</CardTitle>
                        <CardDescription className="text-xs md:text-sm">Create a new writer account with restricted access.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="flex-1 h-10 text-sm"
                                />
                            </div>
                            <div className="flex items-end">
                                <Button type="submit" disabled={isSubmitting} className="w-full h-10">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Writer'}
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
                    {writers.map((writer) => (
                        <Card key={writer.id} className="group hover:border-primary/30 transition-all border-border/50 bg-card/50">
                            <CardHeader className="p-4 md:p-6 pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest bg-secondary text-muted-foreground">
                                        {writer.role}
                                    </span>
                                </div>
                                <CardTitle className="text-lg md:text-xl truncate">{writer.name}</CardTitle>
                                <CardDescription className="text-xs md:text-sm truncate opacity-70 flex items-center gap-1 mt-1">
                                    <Mail className="w-3 h-3" /> {writer.email}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                                <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium text-muted-foreground bg-secondary/50 p-2 rounded-md">
                                    <Calendar className="w-3 h-3 text-primary/40" />
                                    Joined {new Date(writer.created_at).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {writers.length === 0 && (
                        <div className="col-span-full text-center p-12 md:p-20 bg-secondary/20 rounded-2xl border border-dashed border-border/50">
                            <Users className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-10" />
                            <p className="text-sm md:text-base text-muted-foreground italic max-w-xs mx-auto">No writers added yet. Click "Add Writer" to begin.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
