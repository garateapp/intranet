<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganigramImport extends Model
{
    use HasFactory;

    protected $fillable = [
        'original_filename',
        'stored_filename',
        'uploaded_by',
        'row_count',
        'snapshot_json',
        'is_current',
    ];

    protected function casts(): array
    {
        return [
            'row_count' => 'integer',
            'snapshot_json' => 'array',
            'is_current' => 'boolean',
        ];
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
