<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'url',
        'method',
        'ip_address',
        'user_agent',
        'browser',
        'os',
        'device',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByAction($query, $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByDate($query, $date)
    {
        return $query->whereDate('created_at', $date);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopeDesktop($query)
    {
        return $query->where('device', 'desktop');
    }

    public function scopeMobile($query)
    {
        return $query->where('device', 'mobile');
    }

    public function scopeTablet($query)
    {
        return $query->where('device', 'tablet');
    }

    /**
     * Parse user agent to detect browser, OS and device type.
     */
    public static function parseUserAgent($userAgent)
    {
        $info = [
            'browser' => 'Unknown',
            'os' => 'Unknown',
            'device' => 'desktop',
        ];

        if (!$userAgent) {
            return $info;
        }

        // Browser detection
        if (preg_match('/Edg\//i', $userAgent)) {
            $info['browser'] = 'Microsoft Edge';
        } elseif (preg_match('/Chrome\//i', $userAgent) && !preg_match('/Edg\//i', $userAgent)) {
            $info['browser'] = 'Google Chrome';
        } elseif (preg_match('/Firefox\//i', $userAgent)) {
            $info['browser'] = 'Mozilla Firefox';
        } elseif (preg_match('/Safari\//i', $userAgent) && !preg_match('/Chrome\//i', $userAgent)) {
            $info['browser'] = 'Safari';
        } elseif (preg_match('/MSIE|Trident\//i', $userAgent)) {
            $info['browser'] = 'Internet Explorer';
        }

        // OS detection
        if (preg_match('/Windows NT/i', $userAgent)) {
            $info['os'] = 'Windows';
        } elseif (preg_match('/Mac OS X/i', $userAgent)) {
            $info['os'] = 'macOS';
        } elseif (preg_match('/Linux/i', $userAgent)) {
            $info['os'] = 'Linux';
        } elseif (preg_match('/Android/i', $userAgent)) {
            $info['os'] = 'Android';
        } elseif (preg_match('/iPhone|iPad|iPod/i', $userAgent)) {
            $info['os'] = 'iOS';
        }

        // Device detection
        if (preg_match('/Mobile|Android|iPhone|iPad|iPod/i', $userAgent)) {
            $info['device'] = preg_match('/Tablet|iPad/i', $userAgent) ? 'tablet' : 'mobile';
        }

        return $info;
    }
}
