<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class CommentController extends Controller
{
    public function index($issueId)
    {
        $comments = Comment::with(['user', 'replies.user'])
            ->where('issue_id', $issueId)
            ->whereNull('parent_comment_id')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }


    public function store(Request $request)
    {

        $validated = $request->validate([
            'content' => 'required|string|max:255',
            'issue_id' => 'required|exists:issues,id',
            'parent_comment_id' => 'nullable|exists:comments,id',
        ]);

        $user = $request->user();

        Comment::create([
            'content' => $validated['content'],
            'issue_id' => $validated['issue_id'],
            'user_id' => $user->id,
            'parent_comment_id' => $validated['parent_comment_id'] ?? null,
        ]);
    }
}
