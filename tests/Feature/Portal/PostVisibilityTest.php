<?php

namespace Tests\Feature\Portal;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PostVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_home_only_includes_posts_visible_in_public_section(): void
    {
        $category = $this->createCategory();

        $publicPost = $this->createPublishedPost($category, [
            'title' => 'Visible en home publica',
            'show_in_public' => true,
            'show_in_dashboard' => false,
            'is_featured' => true,
        ]);

        $dashboardOnlyPost = $this->createPublishedPost($category, [
            'title' => 'Solo visible en dashboard',
            'show_in_public' => false,
            'show_in_dashboard' => true,
            'is_featured' => true,
        ]);

        $this->get(route('welcome'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Welcome')
                ->where('featuredPosts.0.slug', $publicPost->slug)
                ->missing('featuredPosts.1')
                ->where('recentPosts.0.slug', $publicPost->slug)
                ->where('pinnedPosts', [])
            );

        $this->assertDatabaseHas('posts', ['id' => $dashboardOnlyPost->id]);
    }

    public function test_dashboard_only_includes_posts_visible_for_logged_users(): void
    {
        $user = User::factory()->create();
        $category = $this->createCategory();

        $dashboardPost = $this->createPublishedPost($category, [
            'title' => 'Solo dashboard',
            'show_in_public' => false,
            'show_in_dashboard' => true,
            'is_featured' => true,
        ]);

        $this->createPublishedPost($category, [
            'title' => 'Solo publico',
            'show_in_public' => true,
            'show_in_dashboard' => false,
            'is_featured' => true,
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('featuredPosts', 1)
                ->where('featuredPosts.0.slug', $dashboardPost->slug)
            );
    }

    public function test_public_show_is_available_only_for_public_posts(): void
    {
        $category = $this->createCategory();

        $publicPost = $this->createPublishedPost($category, [
            'title' => 'Publico visible',
            'show_in_public' => true,
            'show_in_dashboard' => false,
        ]);

        $privatePost = $this->createPublishedPost($category, [
            'title' => 'Interno',
            'show_in_public' => false,
            'show_in_dashboard' => true,
        ]);

        $this->get(route('public.posts.show', $publicPost->slug))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Posts/Show')
                ->where('post.slug', $publicPost->slug)
                ->where('isPublicView', true)
            );

        $this->get(route('public.posts.show', $privatePost->slug))
            ->assertNotFound();
    }

    public function test_authenticated_users_can_open_internal_posts_from_the_public_show_page(): void
    {
        $user = User::factory()->create();
        $category = $this->createCategory();

        $internalPost = $this->createPublishedPost($category, [
            'title' => 'Interno autenticado',
            'show_in_public' => false,
            'show_in_dashboard' => true,
        ]);

        $this->actingAs($user)
            ->get(route('public.posts.show', $internalPost->slug))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Posts/Show')
                ->where('post.slug', $internalPost->slug)
                ->where('isPublicView', false)
            );
    }

    private function createCategory(): Category
    {
        return Category::create([
            'name' => 'Noticias',
            'slug' => 'noticias',
            'description' => 'Noticias corporativas',
            'color' => '#038c34',
            'icon' => 'news',
            'sort_order' => 1,
            'is_active' => true,
        ]);
    }

    private function createPublishedPost(Category $category, array $attributes = []): Post
    {
        return Post::create(array_merge([
            'user_id' => User::factory()->create()->id,
            'category_id' => $category->id,
            'title' => 'Post de prueba',
            'slug' => 'post-de-prueba-'.fake()->unique()->slug(),
            'excerpt' => 'Resumen',
            'content' => '<p>Contenido</p>',
            'status' => 'published',
            'is_pinned' => false,
            'is_featured' => false,
            'show_in_public' => true,
            'show_in_dashboard' => true,
            'published_at' => now()->subMinute(),
            'views' => 0,
            'tags' => ['test'],
        ], $attributes));
    }
}
