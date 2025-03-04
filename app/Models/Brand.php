<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $fillable = ['name'];

    public function washers()
    {
        return $this->hasMany(Washer::class);
    }
}
