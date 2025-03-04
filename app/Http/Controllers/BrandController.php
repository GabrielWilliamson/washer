<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Brand;

class BrandController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('brands', [
            'brands' => Brand::all()
        ]);
    }

    public function getBrands(Request $request)
    {
        $search = $request->query('search');

        $brands = Brand::when($search, function ($query, $search) {
            $query->where('name', 'LIKE', '%' . $search . '%');
        })->get();

        return response()->json($brands);
    }
}
