<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceStatusHistory extends Model
{
    use HasFactory;

    protected $table = 'service_status_history';

    protected $fillable = [
        'service_id',
        'old_status',
        'new_status',
        'message',
        'changed_by',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    public function getOldStatusLabelAttribute()
    {
        return match ($this->old_status) {
            'operativo' => 'Operativo',
            'degradado' => 'Degradado',
            'incidente' => 'Incidente',
            'mantenimiento' => 'Mantenimiento',
            default => ucfirst($this->old_status ?? '-'),
        };
    }

    public function getNewLabelAttribute()
    {
        return match ($this->new_status) {
            'operativo' => 'Operativo',
            'degradado' => 'Degradado',
            'incidente' => 'Incidente',
            'mantenimiento' => 'Mantenimiento',
            default => ucfirst($this->new_status),
        };
    }
}
