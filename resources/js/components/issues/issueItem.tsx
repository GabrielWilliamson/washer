'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Issue } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import CommentForm from '../comments/commentForm';
import CommentsList from '../comments/commentList';

interface IssueItemProps {
    issue: Issue;
}

export default function IssueItem({ issue }: IssueItemProps) {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    const formattedDate = formatDistanceToNow(new Date(issue.created_at), { addSuffix: true });

    return (
        <Card className="transition-shadow hover:shadow-md">
            <CardContent className="pt-4">
                <div className="flex flex-col">
                    <div className="mb-3 border-b pb-2">
                        <h3 className="text-base font-medium">{issue.description}</h3>
                    </div>

                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={issue.user?.avatar} alt={issue.user?.name} />
                                <AvatarFallback>{issue.user?.name.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <span>{issue.user?.name}</span>
                        </div>
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-4 py-2">
                <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => setIsCommentsOpen(true)}>
                    <MessageCircle className="h-4 w-4" />
                    <span>Comments</span>
                </Button>
            </CardFooter>

            <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
                <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Issue Details</DialogTitle>
                    </DialogHeader>

                    <div className="mb-6 border-b pb-4">
                        <div className="flex flex-col">
                            <h3 className="mb-3 text-lg font-semibold">{issue.description}</h3>
                            <div className="text-muted-foreground flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={issue.user?.avatar} alt={issue.user?.name} />
                                        <AvatarFallback>{issue.user?.name.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <span>{issue.user?.name}</span>
                                </div>
                                <span>{formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    <CommentsList issueId={issue.id} />
                    <CommentForm issueId={issue.id} />
                </DialogContent>
            </Dialog>
        </Card>
    );
}
