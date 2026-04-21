<?php

namespace Tests\Feature\Portal;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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

        $response = $this->actingAs($visible)
            ->get(route('directory.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Directory/Index')
            ->where('people.data.0.name', $visible->name)
            ->has('people.data', 1)
        );
    }

    public function test_directory_page_renders_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('directory.index'))
            ->assertOk();
    }
}
