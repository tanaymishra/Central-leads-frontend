
export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface Domain {
    id: number;
    name: string;
    url: string;
    api_key?: string;
    created_at: string;
    updated_at: string;
}

export interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    domain_id: number;
    domain_name?: string;
    author_id: string;
    status: 'draft' | 'published' | 'scheduled';
    published_at?: string;
    created_at: string;
    updated_at: string;
}
