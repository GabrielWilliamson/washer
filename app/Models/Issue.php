<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Issue extends Model
{
    protected $fillable = ['description', 'washer_id', 'user_id'];

    public function washer()
    {
        return $this->belongsTo(Washer::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
