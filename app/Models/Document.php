<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Document extends Model
{
    use HasFactory, SoftDeletes, Auditable;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'file_path',
        'file_type',
        'file_size',
        'category_id',
        'version',
        'is_vigant',
        'is_featured',
        'is_published',
        'sort_order',
        'uploaded_by',
    ];

    protected $casts = [
        'is_vigant' => 'boolean',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'file_size' => 'integer',
        'sort_order' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeVigant($query)
    {
        return $query->where('is_vigant', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $categorySlug)
    {
        return $query->whereHas('category', function ($q) use ($categorySlug) {
            $q->where('slug', $categorySlug);
        });
    }

    public function getFileSizeFormattedAttribute()
    {
        if (! $this->file_size) return '-';
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getFileExtensionAttribute()
    {
        return pathinfo($this->file_path, PATHINFO_EXTENSION);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($document) {
            if (empty($document->slug)) {
                $document->slug = Str::slug($document->title);
            }
        });

        static::updating(function ($document) {
            if ($document->isDirty('title') && empty($document->slug)) {
                $document->slug = Str::slug($document->title);
            }
        });
    }
}
