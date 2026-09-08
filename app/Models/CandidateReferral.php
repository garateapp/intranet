<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CandidateReferral extends Model
{
    protected $fillable = [
        'candidate_id',
        'application_id',
        'from_user_id',
        'note',
    ];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function referredUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'candidate_referral_user');
    }
}