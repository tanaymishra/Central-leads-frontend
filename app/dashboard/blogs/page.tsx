
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Search, Loader2, Calendar, Globe, MoreHorizontal, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Blog } from '@/hooks/types';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        try {
            const res = await api.get('/blogs');
            setBlogs(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div className="p-4 md:p-8 lg:p-10 pb-20 max-w-7xl mx-auto relative animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                        Content Repository
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        Manage, create, and publish your articles across all configured domains seamlessly.
                    </p>
                </div>
                <Link href="/dashboard/blogs/new" className="w-full md:w-auto md:shrink-0">
                    <Button size="lg" className="w-full md:w-auto rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 group">
                        <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
                        Write Article
                    </Button>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="mb-8 p-1.5 bg-secondary/30 backdrop-blur-md rounded-2xl border border-border/50 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2 relative z-10">
                <div className="relative flex-1 group pl-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <input
                        placeholder="Search for an article..."
                        className="w-full bg-transparent border-none focus:ring-0 pl-10 pr-4 text-sm py-3 outline-none transition-all placeholder:text-muted-foreground/70"
                    />
                </div>
                <div className="hidden sm:block h-8 w-[1px] bg-border/50 mx-2"></div>
                <div className="flex items-center p-1 bg-background/50 rounded-xl">
                    <Button variant="ghost" size="sm" className="flex-1 rounded-lg text-xs font-semibold px-4 py-2 hover:bg-background shadow-sm hover:shadow-md transition-all">All Domains</Button>
                    <Button variant="ghost" size="sm" className="flex-1 rounded-lg text-xs font-medium px-4 py-2 text-muted-foreground hover:bg-background hover:text-foreground transition-all">Drafts</Button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading content...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {blogs.map((blog, idx) => (
                        <Card
                            key={blog.id}
                            style={{ animationDelay: `${idx * 50}ms` }}
                            className="group flex flex-col h-full hover:border-primary/40 transition-all duration-500 border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:shadow-primary/5 animate-in slide-in-from-bottom-4 fade-in rounded-2xl"
                        >
                            <div className="p-6 flex-1 flex flex-col relative z-10">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${blog.status === 'published' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${blog.status === 'published' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                                        {blog.status}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary/50 px-2.5 py-1 rounded-md">
                                        <Globe className="w-3 h-3 text-primary/60" />
                                        <span className="truncate max-w-[100px]">{blog.domain_name}</span>
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                    {blog.title}
                                </h3>

                                <div className="mt-auto pt-6 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1.5 bg-secondary/40 px-2 py-1 rounded-md">
                                            <Calendar className="w-3.5 h-3.5 text-foreground/50" />
                                            {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1.5 bg-secondary/40 px-2 py-1 rounded-md">
                                        <FileText className="w-3.5 h-3.5 text-foreground/50" />
                                        {Math.max(1, Math.ceil((blog.content || '').length / 500))} min read
                                    </span>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gradient-to-r from-secondary/30 to-transparent border-t border-border/30 flex items-center justify-between group-hover:bg-secondary/50 transition-colors">
                                <Button variant="link" size="sm" className="px-0 text-primary h-auto font-semibold tracking-tight hover:no-underline flex items-center gap-1 group/btn">
                                    Edit Article <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background shadow-sm border border-transparent hover:border-border/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {blogs.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-16 md:p-32 bg-gradient-to-b from-secondary/30 to-transparent rounded-3xl border border-dashed border-border/50 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-background rounded-2xl shadow-sm border border-border/50 flex items-center justify-center mb-6">
                                <FileText className="w-10 h-10 text-primary/40" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-2">No content found</h3>
                            <p className="text-base text-muted-foreground max-w-sm mb-8">Your repository is empty. Create your first piece of content to engage your audience.</p>
                            <Link href="/dashboard/blogs/new">
                                <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all group">
                                    <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
                                    Start Writing
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
