import IssueForm from '@/components/issues/issueForm';
import IssueList from '@/components/issues/issueList';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Washer } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Calendar, Droplet } from 'lucide-react';

type PageProps = {
    mustVerifyEmail: boolean;
    status: string | null;
    washer: Washer;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Washer',
        href: '/washer',
    },
];

export default function Washer() {
    const { washer } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Washer" />
            <div className="m-5">
                <WasherViewCard washer={washer} />
                <div className="my-4 flex justify-between gap-2">
                    <h2 className="text-lg font-semibold">Issues</h2>
                    <IssueForm washer_id={washer.id} name={washer.name} />
                </div>
                <IssueList washer_id={washer.id} />
            </div>
        </AppLayout>
    );
}

function WasherViewCard({ washer }: { washer: Washer }) {
    const { name, brand, ability, description } = washer;

    return (
        <div className="from-primary/10 to-primary/5 flex flex-col rounded-sm bg-gradient-to-r p-4 md:flex-row md:items-stretch">
            <section className="md:w-1/3 md:min-w-[200px]">
                <div className="flex h-full flex-col justify-center">
                    <CardTitle className="line-clamp-1 text-xl font-bold">{name}</CardTitle>
                    <Badge variant="outline" className="bg-primary/10 text-primary mt-2 w-fit text-xs">
                        {brand}
                    </Badge>
                </div>
            </section>
            <div className="mt-4 flex flex-1 flex-col justify-between md:mt-0 md:ml-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Droplet className="h-5 w-5 text-blue-500" />
                        <span>{ability} kg</span>
                        <span className="text-xs">Capacity</span>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Calendar className="h-4 w-4" />
                        <span>Added: {'Unknown'}</span>
                    </div>
                </div>

                {description && <p className="text-muted-foreground mt-3 rounded-md p-2 text-sm">{description}</p>}
            </div>
        </div>
    );
}
