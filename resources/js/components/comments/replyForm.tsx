import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ReplyFormProps {
    issueId: number;
    parentCommentId: number;
    onCancel: () => void;
}

export default function ReplyForm({ issueId, parentCommentId, onCancel }: ReplyFormProps) {
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();

    async function onSubmit() {
        router.post(
            '/comments',
            {
                content: content,
                issue_id: issueId,
                parent_comment_id: parentCommentId,
            },
            {
                onSuccess: () => {
                    toast.success('Comment added successfully!');
                    setContent('');
                    onCancel();
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
        <form onSubmit={handleSubmit} className="space-y-2">
            <AutosizeTextarea
                placeholder="Write a reply..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[60px] text-sm"
            />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" size="sm" disabled={!content.trim()}>
                    Reply
                </Button>
            </div>
        </form>
    );
}
