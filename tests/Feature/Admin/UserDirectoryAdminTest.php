<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserDirectoryAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_directory_user_management(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('users.index'))
            ->assertOk();
    }

    public function test_regular_user_cannot_access_directory_user_management(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user)
            ->get(route('users.index'))
            ->assertRedirect(route('dashboard'));
    }

    public function test_admin_can_update_directory_visibility_for_user(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $target = User::factory()->create(['is_directory_visible' => true]);

        $this->actingAs($admin)
            ->put(route('users.update', $target), [
                'name' => $target->name,
                'email' => $target->email,
                'department' => $target->department,
                'position' => $target->position,
                'is_directory_visible' => false,
                'is_directory_featured' => false,
            ])
            ->assertRedirect(route('users.index'));

        $this->assertDatabaseHas('users', [
            'id' => $target->id,
            'is_directory_visible' => false,
        ]);
    }
}
