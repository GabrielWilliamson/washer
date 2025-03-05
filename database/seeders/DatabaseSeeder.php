<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    public function run(): void
    {

        $brands = [
            'LG',
            'Samsung',
            'Whirlpool',
            'Bosch',
            'GE Appliances',
            'Electrolux',
            'Mabe',
            'Maytag',
            'Frigidaire',
            'Kenmore'
        ];

        foreach ($brands as $brand) {
            Brand::factory()->create([
                'name' => $brand,
            ]);
        }
    }
}
