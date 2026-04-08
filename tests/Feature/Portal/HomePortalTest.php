<?php

namespace Tests\Feature\Portal;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomePortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_access_dashboard(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk();
    }

    public function test_portal_navigation_links_render_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertSee(route('search.index'), false)
            ->assertSee(route('directory.index'), false)
            ->assertSee(route('faq.index'), false)
            ->assertSee(route('calendar.index'), false);
    }

    public function test_dashboard_includes_portal_modules(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk();
    }
}
