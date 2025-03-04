import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Washer {
    id: number;
    name: string;
    description?: string;
    brand: string;
    ability?: number;
    rating?: number;
}
export type Comment = {
    id: number;
    content: string;
    issue_id: number;
    parent_comment_id?: number;
    user_id: number;
    likes: number;
    created_at: string;
    user: User;
    replies?: Comment[];
};

export type Issue = {
    id: number;
    description: string;
    washer_id: number;
    created_at: string;
    user?: User;
};
