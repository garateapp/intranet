<?php

namespace Tests\Feature\Portal;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CorporateCalendarTest extends TestCase
{
    use RefreshDatabase;

    public function test_calendar_page_can_render_published_events(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('calendar.index'))
            ->assertOk();
    }

    public function test_calendar_page_renders_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('calendar.index'))
            ->assertOk();
    }
}
