<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'auditable_type',
        'auditable_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function auditable()
    {
        return $this->morphTo();
    }

    public function scopeForModule($query, $module)
    {
        $modelClass = "App\\Models\\{$module}";
        return $query->where('auditable_type', $modelClass);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByAction($query, $action)
    {
        return $query->where('action', $action);
    }

    public function getActionLabelAttribute()
    {
        $labels = [
            'created' => 'Creado',
            'updated' => 'Actualizado',
            'deleted' => 'Eliminado',
            'status_changed' => 'Cambio de estado',
            'published' => 'Publicado',
            'unpublished' => 'Despublicado',
            'activated' => 'Activado',
            'deactivated' => 'Desactivado',
        ];

        return $labels[$this->action] ?? ucfirst($this->action);
    }
}
