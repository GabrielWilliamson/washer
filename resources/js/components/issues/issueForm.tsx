import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const formSchema = z.object({
    description: z.string().min(1, { message: 'Please enter a description' }).max(800, { message: 'Description must be at most 800 characters.' }),
});

export default function IssueForm({ washer_id, name }: { washer_id: number; name: string }) {
    const props = usePage().props as any;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const toastId = toast.loading('Saving washer...');

        router.post(
            '/issues',
            {
                description: values.description,
                washer_id: washer_id,
            },
            {
                onFinish: () => toast.success('Issue saved successfully!', { id: toastId }),
                onError: (errors) => toast.error('Error saving washer:', errors),
            },
        );

        form.reset();
        toast.dismiss(toastId);
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button>New Issue</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Issue to "{name}"</DialogTitle>
                    <DialogDescription>Create a new issue for a washing machine</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                        <Button type="submit" className="w-full">
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
