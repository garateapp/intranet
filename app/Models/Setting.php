<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'description',
    ];

    public function getValueAttribute()
    {
        return $this->castValue($this->attributes['value'] ?? null);
    }

    protected function castValue($value)
    {
        if ($value === null) {
            return null;
        }

        return match ($this->type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode($value, true),
            'integer' => (int) $value,
            'float' => (float) $value,
            default => $value,
        };
    }

    public static function get($key, $default = null)
    {
        $setting = static::where('key', $key)->first();

        return $setting?->value ?? $default;
    }

    public static function set($key, $value)
    {
        return static::updateOrCreate(
            ['key' => $key],
            ['value' => is_array($value) ? json_encode($value) : $value]
        );
    }

    public static function group($group)
    {
        return static::where('group', $group)->get()->pluck('value', 'key');
    }

    public function scopeGroup($query, $group)
    {
        return $query->where('group', $group);
    }
}
