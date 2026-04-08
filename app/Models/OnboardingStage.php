<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnboardingStage extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'title',
        'description',
        'sort_order',
        'is_active',
        'target_role',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function tasks()
    {
        return $this->hasMany(OnboardingTask::class)->orderBy('sort_order');
    }

    public function activeTasks()
    {
        return $this->hasMany(OnboardingTask::class)->where('is_active', true)->orderBy('sort_order');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function scopeForRole($query, $role = null)
    {
        if ($role) {
            return $query->where(function ($q) use ($role) {
                $q->whereNull('target_role')
                  ->orWhere('target_role', $role);
            });
        }
        return $query->whereNull('target_role');
    }
}
