import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import type { ComboboxOption } from '@/components/ui/combobox';
import { Combobox } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

async function fetchBrandsBySearch(searchTerm: string): Promise<ComboboxOption[]> {
    const response = await fetch(`/api/brands?search=${encodeURIComponent(searchTerm)}`);

    if (!response.ok) {
        throw new Error('Failed to fetch brands');
    }

    const data = await response.json();
    return data.map((brand: any) => ({
        value: brand.id.toString(),
        label: brand.name,
    }));
}

export function useSearchBrands(searchTerm: string) {
    return useQuery({
        queryKey: ['brands', searchTerm],
        queryFn: () => fetchBrandsBySearch(searchTerm),
        staleTime: 5 * 60 * 1000,
        enabled: searchTerm.length > 0,
    });
}

const formSchema = z.object({
    name: z
        .string()
        .min(7, {
            message: 'Model Name must be at least 7 characters.',
        })
        .max(100, { message: 'Model Name must be at most 100 characters.' }),
    description: z
        .string()
        .min(1, { message: 'Please enter a description' })
        .max(200, { message: 'Description must be at most 200 characters.' })
        .optional(),
    ability: z.number().int().positive({ message: 'Ability must be a positive number' }),
    brandId: z.string().min(1, { message: 'Please select a brand' }),
});

export default function WasherForm() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: brands = [] } = useSearchBrands(searchTerm);
    const props = usePage().props as any;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            ability: 0,
            brandId: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        router.post(
            '/washers',
            {
                name: values.name,
                description: values.description || null,
                ability: values.ability,
                brandId: values.brandId,
            },
            {
                onFinish: () => toast.success('Washer saved successfully!', { id: toastId }),
                onError: (errors) => toast.error('Error saving washer:', errors),
            },
        );

        form.reset();
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button>New Washer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Washer</DialogTitle>
                    <DialogDescription>Create a new record for a washing machine</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Turbo drum" {...field} />
                                    </FormControl>
                                    <FormDescription>Please add your washer model name</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <AutosizeTextarea placeholder="" {...field} />
                                    </FormControl>
                                    <FormDescription>Please add description</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ability"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ability (kg)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="8"
                                            {...field}
                                            // Convert string value to number for the form state
                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            // Ensure we don't pass invalid values like NaN
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormDescription>Maximum load capacity in kilograms</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="brandId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={brands}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select a brand..."
                                            searchPlaceholder="Search brands..."
                                            emptyMessage="No brands found."
                                            onSearchChange={setSearchTerm}
                                        />
                                    </FormControl>
                                    <FormDescription>Select the manufacturer of the washer</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
