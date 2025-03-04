import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import StarRating from '@/components/washers/raiting';
import WasherForm from '@/components/washers/washerForm';
import type { Washer } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Droplet, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

type WasherDashboardProps = {
    washers: Washer[];
};

async function fetchBrandsBySearch(searchTerm: string) {
    if (!searchTerm || searchTerm.length < 2) return [];

    try {
        const response = await fetch(`/api/brands?search=${encodeURIComponent(searchTerm)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch brands');
        }

        const data = await response.json();
        return data.map((brand: any) => ({
            value: brand.id.toString(),
            label: brand.name,
        }));
    } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
}

export function useSearchBrands(searchTerm: string) {
    return useQuery({
        queryKey: ['brands', searchTerm],
        queryFn: () => fetchBrandsBySearch(searchTerm),
        staleTime: 5 * 60 * 1000,
        enabled: searchTerm.length >= 2,
    });
}

export default function WasherView({ washers }: WasherDashboardProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [brandSearchTerm, setBrandSearchTerm] = useState('');
    const { data: brands = [], isLoading: brandsLoading } = useSearchBrands(brandSearchTerm);
    const [brandFilter, setBrandFilter] = useState<string>('');
    const [capacityFilter, setCapacityFilter] = useState<string>('all');
    const [ratingFilter, setRatingFilter] = useState<number>(0);

    const enhancedWashers = washers.map((washer) => ({
        ...washer,
        brand: washer.brand!,
        model: washer.name,
        capacity: washer.ability || Math.floor(Math.random() * 10) + 5, // Random capacity between 5-15kg
        description: washer.description,
        rating: washer.rating || Math.floor(Math.random() * 5) + 1,
    }));

    const filteredWashers = enhancedWashers.filter((washer) => {
        // Text search filter
        const matchesSearch =
            washer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            washer.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            washer.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (washer.description && washer.description.toLowerCase().includes(searchTerm.toLowerCase()));

        // Brand filter
        const matchesBrand = !brandFilter || washer.brand === brandFilter;

        // Capacity filter
        let matchesCapacity = true;
        if (capacityFilter === 'small') {
            matchesCapacity = washer.ability! >= 5 && washer.ability! <= 7;
        } else if (capacityFilter === 'medium') {
            matchesCapacity = washer.ability! >= 8 && washer.ability! <= 10;
        } else if (capacityFilter === 'large') {
            matchesCapacity = washer.ability! >= 11;
        }

        // Rating filter
        const matchesRating = washer.rating >= ratingFilter;

        return matchesSearch && matchesBrand && matchesCapacity && matchesRating;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setBrandFilter('');
        setCapacityFilter('all');
        setRatingFilter(0);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold">Washer Collection</h1>
                <div className="flex w-full gap-2 sm:w-auto">
                    <WasherForm />
                    <div className="relative flex-1 sm:w-64">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input placeholder="Search washers..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        {searchTerm && (
                            <button className="absolute top-2.5 right-2.5" onClick={() => setSearchTerm('')}>
                                <X className="text-muted-foreground h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className={showFilters ? 'bg-primary/10' : ''}>
                        <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {showFilters && (
                <div className="bg-card rounded-lg border p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">Filter Washers</h3>
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Clear All
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Brand</label>
                            <Combobox
                                options={brands}
                                value={brandFilter}
                                onChange={setBrandFilter}
                                placeholder="Select a brand..."
                                searchPlaceholder="Search brands..."
                                emptyMessage={brandsLoading ? 'Loading brands...' : 'No brands found.'}
                                onSearchChange={setBrandSearchTerm}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Capacity</label>
                            <Select value={capacityFilter} onValueChange={setCapacityFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Any capacity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any capacity</SelectItem>
                                    <SelectItem value="small">Small (5-7kg)</SelectItem>
                                    <SelectItem value="medium">Medium (8-10kg)</SelectItem>
                                    <SelectItem value="large">Large (11kg+)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Minimum Rating</label>
                                <span className="text-sm font-medium">{ratingFilter}/5</span>
                            </div>
                            <Slider value={[ratingFilter]} onValueChange={(values) => setRatingFilter(values[0])} max={5} step={1} className="py-2" />
                            <div className="text-muted-foreground flex justify-between text-xs">
                                <span>Any</span>
                                <span>5 Stars</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative">
                {filteredWashers.length === 0 ? (
                    <div className="bg-muted/20 rounded-lg py-12 text-center">
                        <p className="text-muted-foreground">No washers found matching your criteria.</p>
                        <Button variant="link" onClick={clearFilters} className="mt-2">
                            Clear filters
                        </Button>
                    </div>
                ) : (
                    <WasherGrid washers={filteredWashers} />
                )}
            </div>
        </div>
    );
}

function WasherGrid({ washers }: { washers: (Washer & { description?: string; rating?: number })[] }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {washers.map((washer) => (
                <WasherCard
                    key={washer.id}
                    id={washer.id}
                    name={washer.name}
                    brand={washer.brand}
                    ability={washer.ability}
                    description={washer.description}
                    rating={washer.rating}
                />
            ))}
        </div>
    );
}

function WasherCard({ id, name, brand, ability, description, rating: initialRating }: Washer & { description?: string; rating?: number }) {
    return (
        <a href={`/washer/${id}`} className="block h-full">
            <Card className="h-full transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-2">
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="line-clamp-2 h-[56px] overflow-hidden text-xl font-bold">{name}</CardTitle>
                        <Badge variant="outline" className="bg-primary/10 text-primary whitespace-nowrap">
                            {brand}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{ability} kg</span>
                        <span className="text-muted-foreground text-sm">Capacity</span>
                    </div>

                    {description && <div className="text-muted-foreground mt-3 line-clamp-2 text-sm">{description}</div>}

                    <div className="bg-muted/50 mt-4 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Performance Rating</span>
                            <span className="text-sm font-bold">{initialRating}/5</span>
                        </div>
                        <div className="mt-2">
                            <StarRating washerId={id} initialRating={initialRating || 0} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
}
