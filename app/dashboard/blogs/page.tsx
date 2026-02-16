
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Search, Loader2, Calendar, Globe, MoreHorizontal } from 'lucide-react';
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
        <div className="p-8 pb-16 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1 tracking-tight">Blog Repository</h1>
                    <p className="text-muted-foreground">Manage and publish content across all your connected domains.</p>
                </div>
                <Link href="/dashboard/blogs/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Write New Blog
                    </Button>
                </Link>
            </div>

            <Card className="mb-8 border-border/50 bg-card/30">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            placeholder="Filter blogs by title, tags or domain..."
                            className="w-full bg-transparent border-none focus:ring-0 pl-10 text-sm py-2"
                        />
                    </div>
                    <div className="h-6 w-[1px] bg-border mr-2"></div>
                    <Button variant="ghost" size="sm" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">All Domains</Button>
                    <Button variant="ghost" size="sm" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Drafts</Button>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                </div>
            ) : (
                <div className="space-y-4">
                    {blogs.map((blog) => (
                        <Card key={blog.id} className="group hover:border-primary/30 transition-all border-border/50 bg-card/50 overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${blog.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                            {blog.status}
                                        </span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            {blog.domain_name}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{blog.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5" />
                                            {Math.ceil((blog.content || '').length / 500)} min read
                                        </span>
                                    </div>
                                </div>
                                <div className="px-6 py-4 md:py-0 bg-secondary/10 md:bg-transparent border-t md:border-t-0 md:border-l border-border/30 flex items-center gap-2">
                                    <Button variant="outline" size="sm">Edit</Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {blogs.length === 0 && (
                        <div className="text-center p-20 bg-secondary/20 rounded-2xl border border-dashed border-border/50">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-10" />
                            <p className="text-muted-foreground italic mb-6">Your blog repository is empty.</p>
                            <Link href="/dashboard/blogs/new">
                                <Button variant="outline">Start Writing Today</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
