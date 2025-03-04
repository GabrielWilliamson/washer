<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use Illuminate\Http\Request;

class IssuesController extends Controller
{
    // esto debe de retornar una lista de issues en formato json 
    public function index(Request $request)
    {
        $washerId = $request->query('washer_id');

        $issues = Issue::with('user')
            ->when($washerId, function ($query, $washerId) {
                $query->where('washer_id', $washerId);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($issues);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'washer_id' => 'required|exists:washers,id',
            'description' => 'nullable|string|min:7|max:200',
        ]);

        Issue::create([
            'description' => $validated['description'],
            'washer_id' => $validated['washer_id'],
            'user_id' => $user->id,
        ]);

        return redirect()->back()->with('success', 'Issue saved successfully!');
    }
}
