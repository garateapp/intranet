<?php

namespace Tests\Feature\Admin;

use App\Models\Faq;
use App\Models\FaqCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FaqManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_faqs_index(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('faqs.index'))
            ->assertOk();
    }

    public function test_admin_can_create_faq(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = FaqCategory::factory()->create(['is_active' => true]);

        $this->actingAs($admin)
            ->post(route('faqs.store'), [
                'faq_category_id' => $category->id,
                'question' => 'Test question?',
                'answer' => 'Test answer',
                'is_published' => true,
            ])
            ->assertRedirect(route('faqs.index'));

        $this->assertDatabaseHas('faqs', [
            'question' => 'Test question?',
        ]);
    }
}
