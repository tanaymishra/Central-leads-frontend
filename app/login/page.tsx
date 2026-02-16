'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(email, password);

        if (!result.success) {
            setError(result.error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background selection:bg-primary/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-md p-4 relative z-10">
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1 flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 border border-primary/20">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Admin Portal</CardTitle>
                        <CardDescription className="text-muted-foreground text-center">
                            Secure access for the Central Leads System
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="pl-10 h-11 bg-background/50 border-border/50 focus-visible:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10 h-11 bg-background/50 border-border/50 focus-visible:ring-primary/20"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm py-3 px-4 rounded-lg animate-in fade-in zoom-in duration-300">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 text-base font-semibold transition-all active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-border/50 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">
                                © {new Date().getFullYear()} Central Leads Management
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
