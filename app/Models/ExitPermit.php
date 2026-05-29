<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExitPermit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'manager_id',
        'fecha_salida',
        'hora_salida',
        'fecha_retorno',
        'hora_retorno',
        'motivo',
        'observaciones',
        'status',
        'admin_notes',
        'rejection_reason',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'fecha_salida' => 'date:Y-m-d',
            'fecha_retorno' => 'date:Y-m-d',
            'hora_salida' => 'string',
            'hora_retorno' => 'string',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
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
            'aprobada' => 'bg-green-100 text-green-800',
            'rechazada' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function getStatusLabelAttribute()
    {
        return match ($this->status) {
            'pendiente' => 'Pendiente',
            'aprobada' => 'Aprobada',
            'rechazada' => 'Rechazada',
            default => ucfirst(str_replace('_', ' ', $this->status)),
        };
    }
}
