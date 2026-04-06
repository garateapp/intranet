<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Link;
use App\Models\User;
use App\Models\Comment;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function welcome()
    {
        $featuredPosts = Post::with(['user', 'category'])
            ->published()
            ->featured()
            ->latest('published_at')
            ->take(3)
            ->get();

        $pinnedPosts = Post::with(['user', 'category'])
            ->published()
            ->pinned()
            ->latest('published_at')
            ->take(5)
            ->get();

        $recentPosts = Post::with(['user', 'category'])
            ->published()
            ->latest('published_at')
            ->take(6)
            ->get();

        $activeLinks = Link::with(['user', 'category'])
            ->active()
            ->ordered()
            ->take(8)
            ->get();

        $categories = Category::active()
            ->withCount('posts')
            ->ordered()
            ->get();

        return Inertia::render('Welcome', [
            'featuredPosts' => $featuredPosts,
            'pinnedPosts' => $pinnedPosts,
            'recentPosts' => $recentPosts,
            'activeLinks' => $activeLinks,
            'categories' => $categories,
        ]);
    }

    public function index()
    {
        $carouselPosts = Post::with(['user', 'category'])
            ->published()
            ->where(function ($query) {
                $query->where('is_featured', 1)
                      ->orWhere('is_pinned', 1);
            })
            ->latest('published_at')
            ->get();

        $stats = [
            'total_posts' => Post::count(),
            'published_posts' => Post::published()->count(),
            'draft_posts' => Post::draft()->count(),
            'total_links' => Link::count(),
            'active_links' => Link::active()->count(),
            'total_users' => User::count(),
            'total_comments' => Comment::count(),
            'recent_posts' => $carouselPosts->isEmpty()
                ? Post::with(['user', 'category'])
                    ->latest()
                    ->take(5)
                    ->get()
                : $carouselPosts,
            'recent_links' => Link::with(['user', 'category'])
                ->latest()
                ->take(5)
                ->get(),
        ];

        // All posts for the grid view
        $allPosts = Post::with(['user', 'category'])
            ->published()
            ->latest('published_at')
            ->take(6)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'allPosts' => $allPosts,
        ]);
    }
}
