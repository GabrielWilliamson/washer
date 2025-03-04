<?php

namespace App\Http\Controllers;

use App\Models\Washer;
use Illuminate\Http\Request;
use Inertia\Inertia;


class WasherController extends Controller
{
    public function index()
    {
        return Inertia::render('washers', [
            'washers' => Washer::select('washers.id', 'washers.name', 'brands.name as brand', 'washers.ability')
                ->join('brands', 'washers.brand_id', '=', 'brands.id')
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:7|max:100',
            'description' => 'nullable|string|min:7|max:200',
            'ability' => 'required|integer|min:1',
            'brandId' => 'required|exists:brands,id',
        ]);

        Washer::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'ability' => $validated['ability'],
            'brand_id' => $validated['brandId'],
        ]);
    }

    public function show($id)
    {
        $washer = Washer::select('washers.id', 'washers.name', 'brands.name as brand', 'washers.ability')
            ->join('brands', 'washers.brand_id', '=', 'brands.id')
            ->where('washers.id', $id)
            ->first();

        if (!$washer) {
            abort(404);
        }

        return Inertia::render('washer', ['washer' => $washer]);
    }
}
