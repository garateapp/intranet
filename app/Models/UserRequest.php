<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserRequest extends Model
{
    use HasFactory, SoftDeletes, Auditable;

    protected $fillable = [
        'user_id',
        'request_type_id',
        'title',
        'description',
        'status',
        'reference_code',
        'admin_notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'created_by' => 'integer',
        'updated_by' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function requestType()
    {
        return $this->belongsTo(RequestType::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pendiente');
    }

    public function getStatusBadgeColorAttribute()
    {
        return match ($this->status) {
            'pendiente' => 'bg-gray-100 text-gray-800',
            'en_revision' => 'bg-yellow-100 text-yellow-800',
            'aprobada' => 'bg-green-100 text-green-800',
            'rechazada' => 'bg-red-100 text-red-800',
            'completada' => 'bg-blue-100 text-blue-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function getStatusLabelAttribute()
    {
        return match ($this->status) {
            'pendiente' => 'Pendiente',
            'en_revision' => 'En Revisión',
            'aprobada' => 'Aprobada',
            'rechazada' => 'Rechazada',
            'completada' => 'Completada',
            default => ucfirst(str_replace('_', ' ', $this->status)),
        };
    }

    public static function generateReferenceCode()
    {
        do {
            $code = 'SOL-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
        } while (static::where('reference_code', $code)->exists());

        return $code;
    }

    public function updateStatus($newStatus, $adminNotes = null)
    {
        $oldStatus = $this->status;
        $this->status = $newStatus;
        $this->updated_by = auth()->id();
        if ($adminNotes) {
            $this->admin_notes = $adminNotes;
        }
        $this->save();

        $this->auditStatusChange($oldStatus, $newStatus, $adminNotes);
    }
}
