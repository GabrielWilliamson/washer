import type { Comment } from '@/types';
import { useQuery } from '@tanstack/react-query';
import CommentItem from './commentItem';

interface CommentsListProps {
    issueId: number;
}

export default function CommentsList({ issueId }: CommentsListProps) {
    const {
        data: comments = [],
        isLoading,
        isError,
    } = useQuery<Comment[]>({
        queryKey: ['comments', issueId],
        queryFn: async () => {
            const response = await fetch(`/api/issues/${issueId}/comments`);
            return response.json();
        },
    });

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading issues...</div>;
    }

    if (isError) {
        return <div className="flex justify-center p-8 text-red-500">Error loading issues.</div>;
    }

    if (isLoading) {
        return <div className="py-4 text-center">Loading comments...</div>;
    }

    if (comments.length === 0) {
        return <div className="text-muted-foreground py-4 text-center">No comments yet. Be the first to comment!</div>;
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Comments</h3>
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} issueId={issueId} />
                ))}
            </div>
        </div>
    );
}
