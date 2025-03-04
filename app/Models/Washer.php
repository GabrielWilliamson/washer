<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Washer extends Model
{
    protected $fillable = ['name', 'description', 'brand_id', 'ability'];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}
