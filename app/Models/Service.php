<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Service extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'status',
        'status_message',
        'last_checked_at',
        'sort_order',
        'is_active',
        'is_public',
    ];

    protected $casts = [
        'last_checked_at' => 'datetime',
        'is_active' => 'boolean',
        'is_public' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function statusHistory()
    {
        return $this->hasMany(ServiceStatusHistory::class)->latest();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeOperativos($query)
    {
        return $query->where('status', 'operativo');
    }

    public function getStatusBadgeColorAttribute()
    {
        return match ($this->status) {
            'operativo' => 'bg-green-100 text-green-800',
            'degradado' => 'bg-yellow-100 text-yellow-800',
            'incidente' => 'bg-red-100 text-red-800',
            'mantenimiento' => 'bg-blue-100 text-blue-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function getStatusLabelAttribute()
    {
        return match ($this->status) {
            'operativo' => 'Operativo',
            'degradado' => 'Degradado',
            'incidente' => 'Incidente',
            'mantenimiento' => 'Mantenimiento',
            default => ucfirst($this->status),
        };
    }

    public function updateStatus($newStatus, $message = null)
    {
        $oldStatus = $this->status;

        $this->status = $newStatus;
        $this->status_message = $message;
        $this->last_checked_at = now();
        $this->save();

        ServiceStatusHistory::create([
            'service_id' => $this->id,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'message' => $message,
            'changed_by' => auth()->id(),
        ]);

        $this->auditStatusChange($oldStatus, $newStatus, $message);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($service) {
            if (empty($service->slug)) {
                $service->slug = Str::slug($service->name);
            }
        });
    }
}
