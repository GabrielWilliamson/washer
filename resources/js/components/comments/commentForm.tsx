'use client';

import type React from 'react';

import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CommentFormProps {
    issueId: number;
}

export default function CommentForm({ issueId }: CommentFormProps) {
    const { auth } = usePage<SharedData>().props;
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();

    async function onSubmit() {
        router.post(
            '/comments',
            {
                content: content,
                issue_id: issueId,
            },
            {
                onSuccess: () => {
                    toast.success('Comment added successfully!');
                    setContent('');
                    queryClient.invalidateQueries({ queryKey: ['comments', issueId] });
                },
                onError: (errors) => {
                    toast.error('Error adding comment:');
                    console.error(errors);
                },
            },
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                    <AvatarFallback>{auth.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <AutosizeTextarea
                        placeholder="Add a comment..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[80px]"
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={!content.trim()} className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            Post Comment
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
