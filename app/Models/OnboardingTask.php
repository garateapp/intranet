<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnboardingTask extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'onboarding_stage_id',
        'title',
        'description',
        'task_type',
        'resource_url',
        'sort_order',
        'is_required',
        'is_active',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function stage()
    {
        return $this->belongsTo(OnboardingStage::class, 'onboarding_stage_id');
    }

    public function userProgress()
    {
        return $this->hasMany(UserOnboardingProgress::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
