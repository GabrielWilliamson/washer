<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\WasherController;
use App\Http\Controllers\IssuesController;
use App\Http\Controllers\CommentController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');




Route::middleware(['auth', 'verified'])->group(function () {


    // brands
    Route::get('api/brands', [BrandController::class, 'getBrands']);

    // washers
    Route::get('washers', [WasherController::class, 'index']);
    Route::post('washers', [WasherController::class, 'store']);
    Route::get('washer/{washer}', [WasherController::class, 'show']);


    // issues
    Route::get('api/issues', [IssuesController::class, 'index']);
    Route::post('issues', [IssuesController::class, 'store']);

    Route::get('api/issues/{issueId}/comments', [CommentController::class, 'index']);
    Route::post('comments', [CommentController::class, 'store']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
