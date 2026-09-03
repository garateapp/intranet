<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'avatar_url',
    ];

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
        'phone',
        'location',
        'bio',
        'is_directory_visible',
        'is_directory_featured',
        'organizational_unit_id',
        'manager_id',
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
        'google_token',
        'google_refresh_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
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

    public function organizationalUnit()
    {
        return $this->belongsTo(OrganizationalUnit::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function subordinates()
    {
        return $this->hasMany(User::class, 'manager_id');
    }

    public function onboardingProgress()
    {
        return $this->hasMany(UserOnboardingProgress::class);
    }

    public function requests()
    {
        return $this->hasMany(UserRequest::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function activities()
    {
        return $this->hasMany(UserActivity::class);
    }

    public function sapOwnerMappings(): HasMany
    {
        return $this->hasMany(SapOwnerUser::class);
    }

    public function purchaseInvoiceResponsibilities(): HasMany
    {
        return $this->hasMany(PurchaseInvoiceApprovalResponsible::class);
    }

    public function createdSurveys()
    {
        return $this->hasMany(Survey::class, 'created_by');
    }

    public function surveyResponses()
    {
        return $this->hasMany(SurveyResponse::class);
    }

    // ========== ATS Relationships ==========

    /**
     * Vacantes donde este usuario es gerente de contratación.
     */
    public function managedVacancies(): HasMany
    {
        return $this->hasMany(Vacancy::class, 'hiring_manager_id');
    }

    /**
     * Vacantes creadas por este usuario (reclutador/RRHH).
     */
    public function createdVacancies(): HasMany
    {
        return $this->hasMany(Vacancy::class, 'created_by');
    }

    /**
     * Evaluaciones realizadas por este usuario.
     */
    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class, 'evaluator_id');
    }

    /**
     * Verifica si el usuario tiene un rol dado usando Spatie.
     * Mantiene compatibilidad con el método isAdmin() existente.
     */
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

    /**
     * Get the full URL for the avatar.
     * Handles both local storage paths and external URLs.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (empty($this->avatar)) {
            return null;
        }

        // If it's already a full URL
        if (str_starts_with($this->avatar, 'http')) {
            return $this->avatar;
        }

        // Local storage path - prepend /storage/
        return '/storage/'.$this->avatar;
    }
}
