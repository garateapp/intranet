<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class OrganizationalUnit extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function parent()
    {
        return $this->belongsTo(OrganizationalUnit::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(OrganizationalUnit::class, 'parent_id')->orderBy('sort_order');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    public function getDescendantsAndSelf($depth = 0)
    {
        $result = collect([$this]);
        if ($depth > 10) return $result; // Prevent infinite recursion

        foreach ($this->children as $child) {
            $result = $result->merge($child->getDescendantsAndSelf($depth + 1));
        }

        return $result;
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($unit) {
            if (empty($unit->slug)) {
                $unit->slug = Str::slug($unit->name);
            }
        });

        static::updating(function ($unit) {
            if ($unit->isDirty('name') && empty($unit->slug)) {
                $unit->slug = Str::slug($unit->name);
            }
        });
    }
}
