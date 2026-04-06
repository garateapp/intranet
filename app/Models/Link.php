<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Link extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'url',
        'description',
        'icon',
        'is_external',
        'is_active',
        'clicks',
        'sort_order',
    ];

    protected $casts = [
        'is_external' => 'boolean',
        'is_active' => 'boolean',
        'clicks' => 'integer',
        'sort_order' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('title');
    }

    public function incrementClicks()
    {
        $this->increment('clicks');
    }
}
