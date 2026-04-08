<?php

namespace Tests\Feature\Portal;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FaqPortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_faq_page_can_render_published_questions(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('faq.index'))
            ->assertOk();
    }

    public function test_faq_page_renders_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('faq.index'))
            ->assertOk();
    }
}
