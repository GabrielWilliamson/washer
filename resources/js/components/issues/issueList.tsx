import type { Issue } from '@/types';
import { useQuery } from '@tanstack/react-query';
import IssueItem from './issueItem';

interface IssueListProps {
    washer_id: number;
}

export default function IssueList({ washer_id }: IssueListProps) {
    const {
        data: issues = [],
        isLoading,
        isError,
    } = useQuery<Issue[]>({
        queryKey: ['issues', washer_id],
        queryFn: async () => {
            const response = await fetch(`/api/issues?washer_id=${washer_id}`);
            return response.json();
        },
    });

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading issues...</div>;
    }

    if (isError) {
        return <div className="flex justify-center p-8 text-red-500">Error loading issues.</div>;
    }

    return (
        <div className="bg-muted/50 rounded-lg p-4">
            {issues.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center">No issues reported yet.</p>
            ) : (
                <div className="space-y-4">
                    {issues.map((issue) => (
                        <IssueItem key={issue.id} issue={issue} />
                    ))}
                </div>
            )}
        </div>
    );
}
