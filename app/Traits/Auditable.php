<?php

namespace App\Traits;

use App\Models\AuditLog;

trait Auditable
{
    public static function bootAuditable()
    {
        static::created(function ($model) {
            $model->auditAction('created');
        });

        static::updated(function ($model) {
            $model->auditAction('updated');
        });

        static::deleted(function ($model) {
            $model->auditAction('deleted');
        });
    }

    public function auditAction($action)
    {
        if (! auth()->check()) {
            return;
        }

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'auditable_type' => get_class($this),
            'auditable_id' => $this->id,
            'old_values' => $action === 'created' ? null : $this->getOriginal(),
            'new_values' => $action === 'deleted' ? null : $this->getAttributes(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function auditStatusChange($oldStatus, $newStatus, $message = null)
    {
        if (! auth()->check()) {
            return;
        }

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'status_changed',
            'auditable_type' => get_class($this),
            'auditable_id' => $this->id,
            'old_values' => ['status' => $oldStatus],
            'new_values' => ['status' => $newStatus, 'message' => $message],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function auditLogs()
    {
        return $this->morphMany(AuditLog::class, 'auditable');
    }
}
