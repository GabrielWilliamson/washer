import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { CornerDownRight, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import ReplyForm from './replyForm';

interface CommentItemProps {
    comment: Comment;
    issueId: number;
    isReply?: boolean;
    parentUser?: string;
}

export default function CommentItem({ comment, issueId, isReply = false, parentUser }: CommentItemProps) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(comment.likes);
    const [showReplyForm, setShowReplyForm] = useState(false);

    const formattedDate = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });

    const handleLike = () => {
        // In a real app, you would call an API to like/unlike the comment
        if (liked) {
            setLikesCount(likesCount - 1);
        } else {
            setLikesCount(likesCount + 1);
        }
        setLiked(!liked);
    };

    return (
        <div className={`${isReply ? 'relative mt-3 ml-12' : ''}`}>
            {isReply && (
                <div className="absolute top-4 -left-6 h-full">
                    <div className="border-muted-foreground/30 absolute top-0 left-0 h-6 w-6 rounded-bl-lg border-b-2 border-l-2"></div>
                </div>
            )}
            <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user?.avatar} alt={comment.user?.name} />
                    <AvatarFallback>{comment.user?.name.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className={`rounded-lg ${isReply ? 'bg-muted/50 border-muted border' : 'bg-muted'} p-3`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">{comment.user.name}</p>
                                {isReply && parentUser && (
                                    <div className="text-muted-foreground mt-0.5 flex items-center text-xs">
                                        <CornerDownRight className="mr-1 h-3 w-3" />
                                        <span>
                                            Replying to <span className="font-medium">@{parentUser}</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Report</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <p className="mt-1 text-sm">{comment.content}</p>
                    </div>

                    <div className="mt-1 ml-1 flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex h-6 items-center gap-1 px-2 ${liked ? 'text-red-500' : ''}`}
                            onClick={handleLike}
                        >
                            <Heart className="h-3.5 w-3.5" fill={liked ? 'currentColor' : 'none'} />
                            <span className="text-xs">{likesCount}</span>
                        </Button>

                        {!isReply && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex h-6 items-center gap-1 px-2"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                            >
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span className="text-xs">Reply</span>
                            </Button>
                        )}

                        <span className="text-muted-foreground text-xs">{formattedDate}</span>
                    </div>

                    {showReplyForm && (
                        <div className="mt-3">
                            <ReplyForm issueId={issueId} parentCommentId={comment.id} onCancel={() => setShowReplyForm(false)} />
                        </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 space-y-3">
                            {comment.replies.map((reply) => (
                                <CommentItem key={reply.id} comment={reply} issueId={issueId} isReply={true} parentUser={comment.user.name} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
