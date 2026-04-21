<?php

namespace Tests\Feature\Portal;

use App\Models\Survey;
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

    public function test_dashboard_includes_portal_modules(): void
    {
        $user = User::factory()->create();
        $admin = User::factory()->create(['role' => 'admin']);
        $survey = Survey::create([
            'created_by' => $admin->id,
            'title' => 'Encuesta visible',
            'description' => 'Encuesta en home',
            'is_anonymous' => true,
            'is_published' => true,
            'ends_at' => now()->addDay(),
        ]);
        $question = $survey->questions()->create([
            'prompt' => '¿Todo bien?',
            'sort_order' => 0,
        ]);
        $question->options()->createMany([
            ['label' => 'Sí', 'sort_order' => 0],
            ['label' => 'No', 'sort_order' => 1],
        ]);

        $response = $this->actingAs($user)
            ->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(function ($page) {
            $page->has('hero')
                 ->has('quickLinks')
                 ->has('featuredPosts')
                 ->has('events')
                 ->has('directoryUsers')
                 ->has('faqs')
                 ->has('hrPortal')
                 ->has('surveys', 1);
        });
    }
}
