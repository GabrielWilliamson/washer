import WasherView from '@/components/washers/washerView';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Washer } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type PageProps = {
    mustVerifyEmail: boolean;
    status: string | null;
    washers: Washer[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Washers',
        href: '/washers',
    },
];

export default function Washers() {
    const { washers } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Washers" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <WasherView washers={washers} />
            </div>
        </AppLayout>
    );
}
