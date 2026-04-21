<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Survey extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by',
        'title',
        'description',
        'is_anonymous',
        'is_published',
        'ends_at',
    ];

    protected function casts(): array
    {
        return [
            'is_anonymous' => 'boolean',
            'is_published' => 'boolean',
            'ends_at' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(SurveyQuestion::class)->orderBy('sort_order');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(SurveyResponse::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function isClosed(): bool
    {
        return $this->ends_at->isPast();
    }

    public function isOpen(): bool
    {
        return ! $this->isClosed();
    }

    public function endsAtLabel(): string
    {
        return $this->ends_at
            ->copy()
            ->timezone(config('app.timezone'))
            ->translatedFormat('d/m/Y H:i');
    }

    public function hasResponseFrom(?User $user, ?string $anonymousToken): bool
    {
        if ($this->is_anonymous) {
            if (! $anonymousToken) {
                return false;
            }

            return $this->responses()
                ->where('anonymous_token', $anonymousToken)
                ->exists();
        }

        if (! $user) {
            return false;
        }

        return $this->responses()
            ->where('user_id', $user->id)
            ->exists();
    }
}
