export interface BlogPost {
    id: string;
    title: string;
    title_tr?: string; // Turkish title
    excerpt: string;
    excerpt_tr?: string; // Turkish excerpt
    content: string;
    content_tr?: string; // Turkish content
    image: string;
    date: string;
    category: string;
    category_tr?: string; // Turkish category
    readTime?: string;
    readTime_tr?: string; // Turkish read time (e.g., "3 dk")
    order?: number;
}

import blogData from "@/data/blogs.json";

export const initialBlogs: BlogPost[] = blogData as BlogPost[];
