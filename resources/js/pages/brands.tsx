import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type Brand = {
    id: number;
    name: string;
    count?: number;
};

type PageProps = {
    mustVerifyEmail: boolean;
    status: string | null;
    brands: Brand[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Brands',
        href: '/brands',
    },
];

export default function Brands() {
    const { brands } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Brands" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h2>Marcas</h2>
                <div className="flex gap-3">
                    {brands.map((brand) => (
                        <div key={brand.id} className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <h2 className="text-lg">{brand.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
