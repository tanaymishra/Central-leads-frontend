
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save, Send, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Globe, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function NewBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [domains, setDomains] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        domain_id: '',
        status: 'draft'
    });

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const res = await api.get('/domains');
                setDomains(res.data.data);
                if (res.data.data.length > 0) {
                    setFormData(prev => ({ ...prev, domain_id: res.data.data[0].id.toString() }));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDomains();
    }, []);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setFormData({ ...formData, title, slug });
    };

    const handleSave = async (status: string) => {
        setLoading(true);
        try {
            await api.post('/blogs', { ...formData, status });
            router.push('/dashboard/blogs');
        } catch (err) {
            console.error(err);
            alert('Failed to save blog. Slug might be duplicate.');
        } finally {
            setLoading(false);
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'code-block'],
            ['clean'],
        ],
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'link', 'image', 'code-block'
    ];

    return (
        <div className="p-8 pb-32 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/blogs">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Compose Blog</h1>
                    <p className="text-sm text-muted-foreground">Draft and publish high-quality content for your websites.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Main */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
                        <Input
                            placeholder="Post Title"
                            className="text-2xl font-bold h-16 border-none shadow-none rounded-none px-6 focus-visible:ring-0"
                            value={formData.title}
                            onChange={handleTitleChange}
                        />
                        <div className="border-y border-border/30 bg-secondary/20 px-6 py-2 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                            <span>slug:</span>
                            <input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="bg-transparent border-none focus:ring-0 w-full"
                            />
                        </div>
                        <div className="quill-editor-container min-h-[500px]">
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(val) => setFormData({ ...formData, content: val })}
                                modules={modules}
                                formats={formats}
                                className="h-full border-none"
                            />
                        </div>
                    </Card>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <Card className="border-border/50 shadow-sm bg-card">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Domain</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-secondary/50 border border-border/50 rounded-lg h-10 px-3 pr-10 appearance-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.domain_id}
                                        onChange={(e) => setFormData({ ...formData, domain_id: e.target.value })}
                                    >
                                        {domains.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Short Excerpt</label>
                                <textarea
                                    className="w-full bg-secondary/50 border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-24"
                                    placeholder="Summarize this post for search engines..."
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3 pt-4 border-t border-border/30">
                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                                    disabled={loading}
                                    onClick={() => handleSave('published')}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                    Publish Now
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full bg-card"
                                    disabled={loading}
                                    onClick={() => handleSave('draft')}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save as Draft
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-card border-dashed">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center gap-3 text-center py-4">
                                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/30">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Featured Image</p>
                                    <p className="text-xs text-muted-foreground mt-1 text-balance">Recommended size: 1200x630px</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs underline text-primary">Upload Asset</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid rgba(0,0,0,0.05) !important;
          padding: 12px 24px !important;
          background: #fcfcfc !important;
        }
        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit !important;
          font-size: 16px !important;
        }
        .ql-editor {
          padding: 32px 40px !important;
          min-height: 500px !important;
        }
        .ql-editor.ql-blank::before {
          left: 40px !important;
          font-style: italic !important;
          color: #94a3b8 !important;
          opacity: 0.5 !important;
        }
      `}</style>
        </div>
    );
}
