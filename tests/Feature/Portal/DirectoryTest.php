<?php

namespace Tests\Feature\Portal;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DirectoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_directory_page_only_lists_visible_users(): void
    {
        $visible = User::factory()->create([
            'is_directory_visible' => true,
            'department' => 'Operaciones',
            'position' => 'Coordinador',
        ]);

        $hidden = User::factory()->create([
            'is_directory_visible' => false,
        ]);

        $this->actingAs($visible)
            ->get(route('directory.index'))
            ->assertOk()
            ->assertSee($visible->name);
    }

    public function test_directory_page_renders_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('directory.index'))
            ->assertOk();
    }
}
