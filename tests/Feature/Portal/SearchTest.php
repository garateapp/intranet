<?php

namespace Tests\Feature\Portal;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_page_renders_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('search.index'))
            ->assertOk();
    }

    public function test_search_accepts_query_parameter(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('search.index', ['q' => 'test']))
            ->assertOk();
    }
}
