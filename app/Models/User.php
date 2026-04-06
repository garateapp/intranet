<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'department',
        'position',
        'avatar',
        'google_id',
        'google_token',
        'google_refresh_token',
        'login_method',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'login_method' => 'string',
        ];
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function links()
    {
        return $this->hasMany(Link::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isUser()
    {
        return $this->role === 'user';
    }

    public function getInitialsAttribute()
    {
        return strtoupper(collect(explode(' ', $this->name))->map(function ($segment) {
            return substr($segment, 0, 1);
        })->take(2)->implode(''));
    }
}
