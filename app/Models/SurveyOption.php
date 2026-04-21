<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SurveyOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_question_id',
        'label',
        'sort_order',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(SurveyQuestion::class, 'survey_question_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(SurveyAnswer::class);
    }
}
