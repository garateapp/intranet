<?php

namespace Tests\Feature\Admin;

use App\Models\CorporateEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CorporateEventManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);
    }

    public function test_admin_can_access_corporate_events_index(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('corporate-events.index'))
            ->assertOk();
    }

    public function test_admin_can_create_corporate_event(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('corporate-events.store'), [
                'title' => 'Test Event',
                'event_date' => now()->addDays(10)->format('Y-m-d H:i:s'),
                'is_published' => true,
            ])
            ->assertRedirect(route('corporate-events.index'));

        $this->assertDatabaseHas('corporate_events', [
            'title' => 'Test Event',
        ]);
    }
}
