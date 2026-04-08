<?php

namespace Tests\Feature\Admin;

use App\Models\FaqCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FaqCategoryManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);
    }

    public function test_admin_can_access_faq_categories_index(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('faq-categories.index'))
            ->assertOk();
    }

    public function test_admin_can_create_faq_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('faq-categories.store'), [
                'name' => 'Test Category',
                'description' => 'Test description',
                'is_active' => true,
            ])
            ->assertRedirect(route('faq-categories.index'));

        $this->assertDatabaseHas('faq_categories', [
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);
    }
}
